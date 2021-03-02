const database = require('../database');
const functions = require('../functions');

const gradesService = {};


gradesService.getGradesByStudentId = (sid) => {
    const id = sid - 1;
    const grades_data = database.grades[id];
    //const student_name = database.students[id]?.name;
    const student_name = (!database.students[id] ? '' : database.students[id].name);
    if (!student_name || !grades_data) return false;
    const grades_by_courses = {};
    grades_data.grades.forEach((grade) => {
        //grades_by_courses[database.courses[grade.course_id - 1]?.name] = grade.grades
        let course_name = (!database.courses[grade.course_id - 1] ? '' : database.courses[grade.course_id - 1].name)
        grades_by_courses[course_name] = grade.grades
    });
    return {sid, student_name, grades_by_courses};
};

gradesService.patchGradesByStudentId = (sid, body) => {
    const id = sid - 1;

    if (!database.students[id] || !database.grades[id]) return false;

    /*let course_id = body?.course_id;
    const grades = body?.grades;

    if (!course_id) course_id = functions.get_id(database.courses, body?.course?.trim());*/
    let course_id = (!body ? '' : body.course_id);
    const grades = (!body ? '' : body.grades);
    const course_name = (!body ? '' : (!body.course ? '' : body.course.trim()));

    if (!course_id) course_id = functions.get_id(database.courses, course_name);
    if (!course_id) return {error: '400 Bad Request', message: 'Course ID/name is missing'};
    if (!grades) return {error: '400 Bad Request', message: 'Grades is/are missing'};

    if (database.grades[id].grades[course_id - 1]) {
        if (Array.isArray(grades)) database.grades[id].grades[course_id - 1].grades = grades;
        else database.grades[id].grades[course_id - 1].grades.push(grades);
    }
    else {
        if (!Array.isArray(grades)) grades = [grades];
        database.grades[id].grades.push({course_id, grades});
    }

    return gradesService.getGradesByStudentId(sid);
};

gradesService.deleteGradesByStudentId = (sid) => {
    const id = sid - 1;

    if (!database.grades[id]) return false;
    else database.grades.splice(id, 1);
    return true;
};

gradesService.getAllGrades = () => {
    const grades = [];

    database.grades.forEach(student => {
        grades.push(gradesService.getGradesByStudentId(student.sid));
    });
    return {grades};
};

gradesService.postGrades = (body) => {
    //let sid = body?.student_id;
    let sid = (!body ? '' : body.student_id);
    let student_name = (!body ? '' : (!body.student ? '' : body.student.trim()));

    if (!sid) functions.get_id(database.students, student_name);
    if (!sid) return {error: '400 Bad Request', message: 'Course ID/name is missing'};

    const id = sid - 1;
    if (!database.students[id]) return {error: '400 Bad Request', message: 'Student does not exist'};

    /*let course_id = body?.course_id;
    const grades = body?.grades;

    if (!course_id) course_id = functions.get_id(database.courses, body?.course?.trim());*/
    let course_id = (!body ? '' : body.course_id);
    const grades = (!body ? '' : body.grades);
    const course_name = (!body ? '' : (!body.course ? '' : body.course.trim()));

    if (!course_id) course_id = functions.get_id(database.courses, course_name);
    if (!course_id) return {error: '400 Bad Request', message: 'Course ID/name is missing'};

    if (database.grades[id].grades[course_id - 1])
        return {error: '400 Bad Request', message: 'Users course is already in database'};

    if (!grades) return {error: '400 Bad Request', message: 'Grades is/are missing'};

    if (!Array.isArray(grades)) grades = [grades];
    database.grades[id].grades.push({course_id, grades});

    return gradesService.getGradesByStudentId(sid);
};


module.exports = gradesService;
