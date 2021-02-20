const functions = require('../functions');
const studentsService = require('../services/studentsService');

const studentsController = {};


studentsController.getStudentById = (req, res) => {
    const student = studentsService.getStudentById(req.params.sid);
    functions.send_result(req, res, student);
};

studentsController.patchStudentById = (req, res) => {
    const student = studentsService.patchStudentById(req.params.sid, req.body.name);
    functions.send_result(req, res, student);
};

studentsController.deleteStudentById = (req, res) => {
    const student = studentsService.deleteStudentById(req.params.sid);
    functions.send_result(req, res, student, 204, true);
};

studentsController.getStudents = (req, res) => {
    const students = studentsService.getStudents();
    res.status(200).json(students);
};

studentsController.postStudent = (req, res) => {
    const student = studentsService.postStudent(req.body.name);
    functions.send_result(req, res, student, 201);
};


module.exports = studentsController;
