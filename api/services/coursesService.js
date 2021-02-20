const database = require('../database');
const functions = require('../functions');

const coursesService = {};


// Helper function to return course data
const _get_course = (cid) => {
    const course = database.courses[cid];
    const teacher = database.teachers[course.teacher_id - 1].name;
    const students = [];
    course.students.forEach((student) => {
        students.push(database.students[student - 1].name);
    });
    return {
        course_id: course.id,
        teacher: teacher,
        students: students
    };
};


coursesService.getCourseById = (id) => {
    const cid = id - 1;
    if (!database.courses[cid]) return false;
    else
        return {
            course: _get_course(cid)
        };
};

coursesService.patchCourseById = (id, body) => {
    const cid = id - 1;
    if (!database.courses[cid]) return false;
    else {
        let name = database.courses[cid].name;
        if (body.name) name = body.name;

        // Allows to omit teacher information, then it remains same,
        // but if the teacher is not in the database, then accepts only the name
        let tid = database.courses[cid].teacher_id;
        if (body.teacher_id || body.teacher) {
            tid = body.teacher_id;
            if (!tid) tid = functions.get_id(database.teachers, body.teacher);
            else if (!database.teachers[tid - 1]) tid = 0;  //  invalid ID not allowed

            if (!tid) {  // new teacher (requires a name to be entered)
                if (body.teacher) {
                    tid = database.teachers.length + 1;
                    database.teachers.push({
                        id: tid,
                        name: body.teacher
                    });
                }
                else return {error: '400 Bad Request', message: 'No acceptable teacher data is given'};
            }
        }

        let student_ids = [];
        if (body.students) body.students.forEach(student => {
            let sid = functions.get_id(database.students, student);
            if (!sid) {
                if (isNaN(parseInt(student))) {  // ignores numeric value
                    sid = database.students.length + 1;
                    database.students.push({
                        id: sid,
                        name: student
                    });
                }
            }
            if (sid) student_ids.push(sid);
        });
        else student_ids = database.courses[cid].students;

        database.courses[cid] = {
            id: id,
            name: name,
            teacher_id: tid,
            students: student_ids
        }
        return {
            course: _get_course(cid)
        };
    }
};

coursesService.deleteCourseById = (id) => {
    const cid = id - 1;
    if (!database.courses[cid]) return false;
    else {
        database.courses.splice(cid, 1);
        return true;
    }
};

coursesService.getCourses = () => {
    const courses = [];
    database.courses.forEach(course => {
        const teacher = database.teachers[course.teacher_id - 1].name;
        const students = [];
        course.students.forEach((student) => {
            students.push(database.students[student - 1].name);
        });
        courses.push({
            course_id: course.id,
            teacher: teacher,
            students: students
        });
    });
    return {
        courses: courses
    };
};

coursesService.postCourse = (body) => {
    // Course name and teacher are mandatory
    if (!body.name) return {error: '400 Bad Request', message: 'Name is missing'};
    if (!body.teacher) return {error: '400 Bad Request', message: 'Teacher is missing'};

    const name = body.name;
    const teacher = body.teacher;
    const new_id = database.courses.length + 1;

    // Looks for existing teacher
    let tid = functions.get_id(database.teachers, teacher);

    if (!tid) {  // new teacher
        tid = database.teachers.length + 1;
        database.teachers.push({
            id: tid,
            name: teacher
        });
    }

    let student_ids = [];
    if (body.students) body.students.forEach(student => {
        let sid = functions.get_id(database.students, student);
        if (!sid) {
            if (isNaN(parseInt(student))) {
                sid = database.students.length + 1;
                database.students.push({
                    id: sid,
                    name: student
                });
            }
        }
        if (sid) student_ids.push(sid);
    });

    database.courses.push({
        id: new_id,
        name: name,
        teacher_id: tid,
        students: student_ids
    });
    return {
        course: _get_course(new_id - 1)
    };
};


module.exports = coursesService;
