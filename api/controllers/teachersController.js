const functions = require('../functions');
const teachersService = require('../services/teachersService');

const teachersController = {};


teachersController.getTeacherById = (req, res) => {
    const teacher = teachersService.getTeacherById(req.params.tid);
    functions.send_result(req, res, teacher);
};

teachersController.patchTeacherById = (req, res) => {
    const teacher = teachersService.patchTeacherById(req.params.tid, req.body.name);
    functions.send_result(req, res, teacher);
};

teachersController.deleteTeacherById = (req, res) => {
    const teacher = teachersService.deleteTeacherById(req.params.tid);
    functions.send_result(req, res, teacher, 204, true);
};

teachersController.getTeachers = (req, res) => {
    const teachers = teachersService.getTeachers();
    res.status(200).json(teachers);
};

teachersController.postTeacher = (req, res) => {
    const teacher = teachersService.postTeacher(req.body.name);
    functions.send_result(req, res, teacher, 201);
};


module.exports = teachersController;
