const database = require('../database');

const gradesService = {};


gradesService.getGradesByStudentId = (sid) => {
    const id = sid - 1;
    const grades_data = database.grades[id];
    const student_name = database.students[id]?.name;
    if (!student_name || !grades_data) return false;
    const grades_by_courses = {};
    grades_data.grades.forEach((grade) => {
        grades_by_courses[database.courses[grade.course_id - 1]?.name] = grade.grades
    });
    return {sid, student_name, grades_by_courses};
};

gradesService.patchGradesByStudentId = (sid, body) => {
    const id = sid - 1;
    if (!database.students[id] || !database.grades[id]) this.default(req, res);
    else {
        // Selle kontrolli osa jätab andmebaasi osa juurde :)
        res.status(200).json({
            message: 'Data changed',
            data: body
        });
    }
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
    // Selle kontrolli osa jätab andmebaasi osa juurde :)
    return {
        message: 'Data added',
        data: body
    };
};


module.exports = gradesService;
