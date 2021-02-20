const database = require('../database');

const gradesService = {};


gradesService.getGradesByStudentId = (id) => {
    const sid = id - 1;
    if (!database.students[sid] || !database.grades[sid]) return false;
    else {
        const grades = database.grades[sid];
        const courses = {};
        grades.grades.forEach((grade) => {
            courses[database.courses[grade.course_id - 1].name] = grade.grades
        });
        return {
            sid: sid,
            student_name: database.students[sid].name,
            grades: courses
        };
    }
};

gradesService.patchGradesByStudentId = (id, body) => {
    const sid = id - 1;
    if (!database.students[sid] || !database.grades[sid]) this.default(req, res);
    else {
        // Selle kontrolli osa jätab andmebaasi osa juurde :)
        res.status(200).json({
            message: 'Data changed',
            data: body
        });
    }
};

gradesService.deleteGradesByStudentId = (id) => {
    const sid = id - 1;
    if (!database.grades[sid]) return false;
    else {
        database.grades.splice(sid, 1);
        return true;
    }
};

gradesService.getAllGrades = () => {
    const result = [];
    database.grades.forEach(grades => {
        const student = database.students[grades.sid - 1].name;
        const courses = {};
        grades.grades.forEach((grade) => {
            courses[database.courses[grade.course_id - 1].name] = grade.grades
        });
        result.push({sid: grades.sid, student_name: student, grades_by_courses: courses});
    });
    return {
        grades: result
    };
};

gradesService.postGrades = (body) => {
    // Selle kontrolli osa jätab andmebaasi osa juurde :)
    return {
        message: 'Data added',
        data: body
    };
};


module.exports = gradesService;
