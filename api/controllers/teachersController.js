const functions = require('../functions');
const { teachersService } = require('../services');

const teachersController = {};


/**
 * Get all teachers
 * GET - /api/teacher
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of teachers
 */
teachersController.getTeachers = (req, res) => {
    const teachers = teachersService.getTeachers();
    res.status(200).json({teachers});
};

/**
 * Get teacher by teacher id
 * GET - /api/teacher/:tid
 * Required values: tid
 * Optional values: none
 * Success: status 200 - OK and list of teacher data
 * Error: status 404 - Not Found and error message
 */
teachersController.getTeacherById = (req, res) => {
    const teacher = teachersService.getTeacherById(req.params.tid);
    functions.send_result(req, res, teacher);
};

/**
 * Create new teacher
 * POST - /api/teacher
 * Required values: name
 * Optional values: none
 * Success: status 201 - Created and id of created teacher
 * Error: status 400 - Bad Request and error message
 */
teachersController.postTeacher = (req, res) => {
    const teacher = teachersService.postTeacher(req.body.name);
    functions.send_result(req, res, teacher, 201);
};

/**
 * Delete teacher by teacher id
 * DELETE - /api/teacher/:tid
 * Required values: tid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 404 - Not Found and error message
 */
teachersController.deleteTeacherById = (req, res) => {
    const teacher = teachersService.deleteTeacherById(req.params.tid);
    functions.send_result(req, res, teacher, 204, true);
};

/**
 * Update teacher by teacher id
 * PATCH - /api/teacher/:tid
 * Required values: tid, name
 * Optional values: none
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 */
teachersController.patchTeacherById = (req, res) => {
    const teacher = teachersService.patchTeacherById(req.params.tid, req.body.name);
    functions.send_result(req, res, teacher);
};


module.exports = teachersController;
