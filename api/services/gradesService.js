const { getStudentById } = require('./studentsService');
const db = require('../db');
const functions = require('../functions');
const { debug } = require('../../config');

const gradesService = {};


gradesService.getAllGrades = async (req) => {
    if (req.userRole === 'Teacher') {
        try {
            const student_grades = (await db.query('SELECT * FROM all_grades'))?.rows ?? [];
            let grades = {};

            /*-*/debug && console.log('getAllGrades().student_grades:', student_grades);
            student_grades.forEach((grade) => {
                if (!grades[grade.student_id])
                    grades[grade.student_id] = {student_id:grade.student_id, student_name:grade.student_name, grades_by_course: {}};

                if (!grades[grade.student_id]['grades_by_course'][grade.course_name])
                    grades[grade.student_id]['grades_by_course'][grade.course_name] = [{ id:grade.id, grade:grade.grade}];
                else grades[grade.student_id]['grades_by_course'][grade.course_name].push({ id:grade.id, grade:grade.grade});
            });
            return {grades};
        }
        catch (err) { return functions.db_error('getAllGrades', err); }
    }
    else return gradesService.getGradesByStudentId(req.userId);
};

gradesService.getGradesByStudentId = async (sid, funcName = 'getGradesByStudentId') => {
    try {
        const student_grades = (await db.query( db.format('SELECT * FROM all_grades WHERE student_id=%L', sid) ))?.rows ?? [];
        if (!student_grades.length)
            return {errCode: 404, error: '404 Not Found', message: 'Student grades not found'};
        
        const student_name = student_grades[0].student_name;
        let grades_by_course = {};

        student_grades.forEach((grade) => {
            if (!grades_by_course[grade.course_name]) grades_by_course[grade.course_name] = [{ id:grade.id, grade:grade.grade}];
            else grades_by_course[grade.course_name].push({ id:grade.id, grade:grade.grade});
        });
        return {student_id:sid, student_name, grades_by_course};
    }
    catch (err) { return functions.db_error(funcName, err); }
};

gradesService.postGrades = async (req) => {
    const { student_id, course_id, grade } = req.body;

    try {
        const student = await getStudentById(student_id);
        if (!student?.student?.id)
            return {errCode: 404, error: '404 Not Found', message: 'Student not found'};


        const result = await db.query( db.format('SELECT student_grade_add(%L, %L, %L)', student_id, course_id, grade) );
        const sid = result?.rows[0]?.student_grade_add ?? 0;
        return {student_id, course_id, grade};
    }
    catch (err) { return functions.db_error('postGrades', err); }

    // TODO: add extra control


    /*let sid = body?.student_id;

    if (!sid) functions.get_id(database.students, body?.student?.trim());
    if (!sid) return {error: '400 Bad Request', message: 'Student ID/name is missing'};

    const id = sid - 1;
    if (!database.students[id]) return {error: '400 Bad Request', message: 'Student does not exist'};

    let course_id = body?.course_id;
    const grades = body?.grades;

    if (!course_id) course_id = functions.get_id(database.courses, body?.course?.trim());
    if (!course_id) return {error: '400 Bad Request', message: 'Course ID/name is missing'};

    if (database.grades[id].grades[course_id - 1])
        return {error: '400 Bad Request', message: 'Users course is already in database'};

    if (!grades) return {error: '400 Bad Request', message: 'Grades is/are missing'};

    if (!Array.isArray(grades)) grades = [grades];
    database.grades[id].grades.push({course_id, grades});

    return gradesService.getGradesByStudentId(sid);*/
};

gradesService.deleteGradesByStudentId = async (sid, body) => {
    const { grade_id } = body;
    let query = '';
    if (!grade_id) query = ['SELECT * FROM student_grades_delete(%L)', sid];
    else query = ['SELECT * FROM student_grade_delete(%L)', grade_id];

    try {
        const student = (await db.query('SELECT * FROM students WHERE id=$1::int', [sid]))?.rows;
        if (!student.length)
            return {errCode: 404, error: '404 Not Found', message: 'Student not found'};

        const result = await db.query( db.format(...query) );
        const grades_delete = result?.rows ?? 0;
        return !grades_delete.length ? false : true;
    }
    catch (err) { return functions.db_error('deleteGradesByStudentId', err); }
};

gradesService.patchGradesByStudentId = async (sid, body) => {
    const { grade_id, grade } = body;
    try {
        const student = (await db.query('SELECT * FROM students WHERE id=$1::int', [sid]))?.rows;
        if (!student.length)
            return {errCode: 404, error: '404 Not Found', message: 'Student not found'};

        const old_grade = (await db.query( db.format('SELECT * FROM all_grades WHERE id=%L', grade_id) ))?.rows[0]?.grade ?? '';
        if (!old_grade)
            return {errCode: 404, error: '404 Not Found', message: 'Grade not found'};

        //TODO: Check, if grade belongs to student

        const result = await db.query( db.format('SELECT * FROM student_grade_patch(%L, %L)', grade_id, grade) );
        const grades_patch = result?.rows[0]?.student_grade_patch ?? 0;

        /*-*/debug && console.log('patchGradesByStudentId().grades_patch:', grades_patch);
        if (!grades_patch) return false;
        return {grade_id, old_grade, new_grade:grade};
    }
    catch (err) { return functions.db_error('patchGradesByStudentId', err); }
};


module.exports = gradesService;
