const { getTeacherById } = require('./teachersService');
const { getStudentById } = require('./studentsService');
const db = require('../db');
const functions = require('../functions');
const { debug } = require('../../config');

const coursesService = {};


coursesService.getCourses = async (req) => {
    try {
        const result = await db.query('SELECT * FROM courses');
        let courses = result?.rows ?? [];

        if (req?.userGroup == 'Admin' || req?.userRole == 'Teacher' || req?.userRole == 'Student') {
            for (let i = 0; i < courses.length; i++) {
                let students = await db.query('SELECT * FROM course_students($1::int)', [courses[i].id]);
                courses[i].students = students?.rows ?? [];
            }
        }
        return {courses};
    }
    catch (err) { return functions.db_error('getCourses', err); }
};

coursesService.getCourseById = async (req) => {
    const { cid } = req.params;

    try {
        const result = await db.query( db.format('SELECT * FROM courses WHERE id=%L', cid) );
        let course = result?.rows[0] ?? {};

        if (!course.id)
            return {errCode: 404, error: '404 Not Found', message: 'Course not found'};

        if (req?.userGroup == 'Admin' || req?.userRole == 'Teacher' || req?.userRole == 'Student') {
            const students = await db.query('SELECT * FROM course_students($1::int)', [cid]);
            course.students = students?.rows ?? [];
        }
        return {course};
    }
    catch (err) { return functions.db_error('getCourseById', err); }
};

coursesService.postCourse = async (req) => {
    const { name, session, teacher_id:tid, teacher_firstname, teacher_lastname } = req.body;
    let teacher = {id:0, role:'Guest'};
    let teacher_id = tid;

    if (!tid) {  // teacher_id not given

        // If firstname or lastname is missing and logged in user is teacher, then use his/her id
        if ((!teacher_firstname || !teacher_lastname) && req.userRole === 'Teacher') {
            teacher_id = req.userId;
            teacher.role = 'Teacher';
        }
        else { // try to get teacher data
            try {
                const query = db.format('SELECT * FROM teacher_by_name(%L, %L)', teacher_firstname, teacher_lastname);
                const result = await db.query(query);
                teacher = result?.rows[0] ?? {id:0};
                teacher_id = teacher.id;
            }
            catch (err) { return functions.db_error('postCourse', err); }
        }
    }
    else {
        teacher = (await getTeacherById(tid)).teacher;
        if (teacher.teacher.id) teacher.role = 'Teacher';
    }

    if (!name || !session || !teacher_id)
        return {error: '400 Bad Request', message: 'Name, session or teacher (ID or firsname/lastname) is missing'};

    if (teacher.role !== 'Teacher')
        return {error: '400 Bad Request', message: 'Posted user (ID or firstname/lastname) is not teacher'};

    try {
        const result = await db.query( db.format('SELECT course_add(%L, %L, %L)', name, session, teacher_id) );
        const id = result?.rows[0]?.course_add ?? -1;
        return {id};
    }
    catch (err) { return db_error('postCourse', err); }

    // TODO: allow adding students
};

coursesService.postCourseById = async (req) => {
    const { student_id:sid, student_firstname, student_lastname } = req.body;
    const { cid} = req.params;
    const course = await coursesService.getCourseById(cid);
    let student_id = sid;
    /*-*/debug && console.log('postCourseById().course:', course);

    if (course.error) return course;
    else if (!course?.course?.id)
        return {errCode: 404, error: '404 Not Found', message: 'Course not found'};
    
    if (!sid) {
        try {
            const query = db.format('SELECT * FROM student_by_name(%L, %L)', student_firstname, student_lastname);
            const result = await db.query(query);
            student_id = result?.rows[0]?.id ?? 0;
        }
        catch (err) { return functions.db_error('postCourseById', err); }
    }
    try {
        const student = await getStudentById(student_id);
        if (!student?.student?.id)
            return {errCode: 404, error: '404 Not Found', message: 'Student not found'};
        
        const result = await db.query( db.format('SELECT course_student_add(%L, %L)', cid, student_id) );
        const id = result?.rows[0]?.course_add ?? -1;
        return {id};
    }
    catch (err) { return db_error('postCourseById', err); }
};

coursesService.deleteCourseStudent = async (body) => {
    const { course_id, student_id:sid, student_firstname, student_lastname } = body;
    const crs = await coursesService.getCourseById(course_id);
    let student_id = sid;

    if (crs.error) return crs;
    else if (!crs.course.id)
        return {errCode: 404, error: '404 Not Found', message: 'Course not found'};

    if (!sid) {
        try {
            const query = db.format('SELECT * FROM student_by_name(%L, %L)', student_firstname, student_lastname);
            const result = await db.query(query);
            student_id = result?.rows[0]?.id ?? 0;
        }
        catch (err) { return functions.db_error('deleteCourseStudent', err); }
    }

    if (!student_id)
        return {errCode: 404, error: '404 Not Found', message: 'Student not found'};

    try {
        const result = await db.query( db.format('SELECT * FROM course_student_remove(%L, %L)', course_id, student_id) );
        if (!result?.rows[0]?.student_id) return false;
        else return true;
    }
    catch (err) { return db_error('deleteCourseStudent', err); }
};

coursesService.deleteCourseById = async (cid) => {
    const crs = await coursesService.getCourseById(cid);

    if (crs.error) return crs;
    else if (!crs.course.id)
        return {errCode: 404, error: '404 Not Found', message: 'Course not found'};

    try {
        const course = await db.query( db.format('SELECT * FROM course_delete(%L)', cid) );
        const course_delete = course?.rows[0].course_delete ?? 0;
        if (course_delete) {
            await db.query( db.format('SELECT * FROM course_students_remove(%L)', cid) );
            return true;
        }
        else return false;
    }
    catch (err) { return db_error('deleteCourseById', err); }
};

coursesService.patchCourseById = async (req) => {
    const { name, session, teacher_id:tid, teacher_firstname, teacher_lastname } = req.body;
    const cid = req.params.cid;
    let teacher = {id:0, role:'Guest'};
    let teacher_id = tid;

    if (!tid) {  // teacher_id not given

        // If firstname or lastname is missing and logged in user is teacher, then use his/her id
        if ((!teacher_firstname || !teacher_lastname) && req.userRole === 'Teacher') {
            teacher_id = req.userId;
            teacher.role = 'Teacher';
        }
        else { // try to get teacher data
            try {
                const query = db.format('SELECT * FROM teacher_by_name(%L, %L)', teacher_firstname, teacher_lastname);
                const result = await db.query(query);
                teacher = result?.rows[0] ?? {id:0};
                teacher_id = teacher.id;
            }
            catch (err) { return functions.db_error('patchCourseById', err); }
        }
    }
    else {
        teacher = (await getTeacherById(tid)).teacher;
        if (teacher.id) teacher.role = 'Teacher';
    }

    if (!name || !session || !teacher_id)
        return {error: '400 Bad Request', message: 'Name, session or teacher (ID or firsname/lastname) is missing'};
    
    if (teacher.role !== 'Teacher')
        return {error: '400 Bad Request', message: 'Posted user (ID or firstname/lastname) is not teacher'};

    try {
        const course_old_data = await db.query( db.format('SELECT * FROM courses WHERE id=%L', cid) );
        const result = await db.query( db.format('SELECT course_add(%L, %L, %L)', name, session, teacher_id) );
        const id = result?.rows[0]?.course_add ?? 0;
        if (!id) return {error: '400 Bad Request', message: 'All data are same, nothing changed'};
        const teacher_name = (teacher_firstname ?? teacher.firstname) +' '+ (teacher_lastname ?? teacher.lastname);
        const cours_new_data = {name, session, teacher:teacher_name};
        return { course_old_data, course_new_data };
    }
    catch (err) { return db_error('patchCourseById', err); }

    // TODO: allow adding students
};


module.exports = coursesService;
