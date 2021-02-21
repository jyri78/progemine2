const functions = require('../functions');
const gradesService = require('../services/gradesService');

const gradesController = {};


gradesController.getGradesByStudentId = (req, res) => {
    const grades = gradesService.getGradesByStudentId(req.params.sid);
    functions.send_result(req, res, grades);
};

gradesController.patchGradesByStudentId = (req, res) => {
    const grade = gradesService.patchGradesByStudentId(req.params.sid, req.body);
    functions.send_result(req, res, grade);
};

gradesController.deleteGradesByStudentId = (req, res) => {
    const grade = gradesService.deleteGradesByStudentId(req.params.sid);
    functions.send_result(req, res, grade, 204, true);
};

gradesController.getAllGrades = (req, res) => {
    const grades = gradesService.getAllGrades();
    res.status(200).json(grades);
};

gradesController.postGrades = (req, res) => {
    const grade = gradesService.postGrades(req.body);
    functions.send_result(req, res, grade, 201);
};


module.exports = gradesController;
