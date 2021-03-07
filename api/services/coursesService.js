const database = require('../database');
const functions = require('../functions');

const coursesService = {};


// Helper function to return course data
const _get_course = (cid) => {
    const course = database.courses[cid];
    const course_id = course.id;
    const teacher = database.teachers[course.teacher_id - 1].name;
    const students = [];

    course.students.forEach((student) => {
        students.push(database.students[student - 1].name);
    });
    return {course_id, teacher, students};
};


coursesService.getCourses = () => {
    const courses = [];

    database.courses.forEach(course => {
        courses.push(coursesService.getCourseById(course.id));
    });
    return courses;
};

coursesService.getCourseById = (cid) => {
    const id = cid - 1;

    if (!database.courses[id]) return false;
    else {
        const course = _get_course(id);
        return {course};
    }
};

coursesService.postCourse = (body) => {
    // Course name and teacher are mandatory
    if (!body.name) return {error: '400 Bad Request', message: 'Name is missing'};
    if (!body.teacher) return {error: '400 Bad Request', message: 'Teacher is missing'};

    const name = body.name;
    const teacher = body.teacher;
    const new_id = database.courses.length + 1;

    // Looks for existing teacher
    let teacher_id = functions.get_id(database.teachers, teacher);

    if (!teacher_id) {  // new teacher
        teacher_id = database.teachers.length + 1;
        database.teachers.push({id:teacher_id, name:teacher});
    }

    let students = [];
    if (body.students)
        body.students.forEach(student => {
            let sid = functions.get_id(database.students, student);

            if (!sid) {
                if (isNaN(parseInt(student))) {
                    sid = database.students.length + 1;
                    database.students.push({id:sid, name:student});
                }
            }
            if (sid) students.push(sid);
        });

    database.courses.push({id:new_id, name, teacher_id, students});

    const course = _get_course(new_id - 1);
    return {course};
};

coursesService.deleteCourseById = (cid) => {
    const id = cid - 1;

    if (!database.courses[id]) return false;
    else database.courses.splice(id, 1);
    return true;
};

coursesService.patchCourseById = (cid, body) => {
    const id = cid - 1;
    let name = database.courses[id]?.name;

    if (!name) return false;
    if (body.name) name = body.name;

    // Allows to omit teacher information, then it remains same,
    // but if the teacher is not in the database, then accepts only the name
    let teacher_id = database.courses[id].teacher_id;

    if (body.teacher_id || body.teacher) {
        teacher_id = body.teacher_id;

        if (!teacher_id) teacher_id = functions.get_id(database.teachers, body.teacher?.trim());
        else if (!database.teachers[teacher_id - 1]) teacher_id = 0;  //  invalid ID not allowed

        if (!teacher_id) {  // new teacher (requires a name to be entered)
            if (body.teacher) {
                teacher_id = database.teachers.length + 1;

                database.teachers.push({
                    id: teacher_id,
                    name: body.teacher.trim()
                });
            }
            else return {error: '400 Bad Request', message: 'No acceptable teacher data is given'};
        }
    }

    let students = [];

    if (body.students)
        body.students.forEach(student => {
            student = student.trim();
            let sid = functions.get_id(database.students, student);

            if (!sid) {
                if (isNaN(parseInt(student))) {  // ignores numeric value
                    sid = database.students.length + 1;
                    database.students.push({id:sid, name:student});
                }
            }

            if (sid) students.push(sid);
        });
    else students = database.courses[id].students;

    database.courses[id] = {id:cid, name, teacher_id, students}

    const course = _get_course(id);
    return {course};
};


module.exports = coursesService;
