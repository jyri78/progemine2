const functions = require('../functions');
const { teachersService } = require('../services');

const teachersController = {};


/**
 * Get all teachers
 * GET - /api/teacher
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of teachers
 * Error: status 403 - Forbidden and errror message
 */
teachersController.getTeachers = async (req, res) => {
    const teachers = await teachersService.getTeachers(req);
    functions.send_result(req, res, teachers);
};

/**
 * Get teacher by teacher id
 * GET - /api/teacher/:tid
 * Required values: tid
 * Optional values: none
 * Success: status 200 - OK and list of teacher data
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
teachersController.getTeacherById = async (req, res) => {
    const teacher = await teachersService.getTeacherById(req.params.tid);
    functions.send_result(req, res, teacher);
};

/**
 * Create new teacher
 * POST - /api/teacher
 * Required values: name
 * Optional values: none
 * Success: status 201 - Created and id of created teacher
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
teachersController.postTeacher = async (req, res) => {
    const teacher = await teachersService.postTeacher(req.body);
    functions.send_result(req, res, teacher, 201);
};

/**
 * Delete teacher by teacher id
 * DELETE - /api/teacher/:tid
 * Required values: tid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
teachersController.deleteTeacherById = async (req, res) => {
    const teacher = await teachersService.deleteTeacherById(req.params.tid);
    functions.send_result(req, res, teacher, 204);
};

/**
 * Update teacher by teacher id
 * PATCH - /api/teacher/:tid
 * Required values: tid, name
 * Optional values: none
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
teachersController.patchTeacherById = async (req, res) => {
    const teacher = await teachersService.patchTeacherById(req.body);
    functions.send_result(req, res, teacher);
};


module.exports = teachersController;
