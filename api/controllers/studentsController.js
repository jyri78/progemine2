const functions = require('../functions');
const { studentsService } = require('../services');

const studentsController = {};


/**
 * Get all students
 * GET - /api/student
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of students
 * Error: status 403 - Forbidden and errror message
 */
studentsController.getStudents = async (req, res) => {
    const students = await studentsService.getStudents(req);
    functions.send_result(req, res, students);
};

/**
 * Get student by student id
 * GET - /api/student/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 200 - OK and list of student data
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
studentsController.getStudentById = async (req, res) => {
    const student = await studentsService.getStudentById(req.params.sid);
    functions.send_result(req, res, student);
};

/**
 * Create new student
 * POST - /api/student
 * Required values: name
 * Optional values: none
 * Success: status 201 - Created and id of created student
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
studentsController.postStudent = async (req, res) => {
    const student = await studentsService.postStudent(req.body);
    functions.send_result(req, res, student, 201);
};

/**
 * Delete student by student id
 * DELETE - /api/student/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
studentsController.deleteStudentById = async (req, res) => {
    const student = await studentsService.deleteStudentById(req.params.sid);
    functions.send_result(req, res, student, 204);
};

/**
 * Update student by student id
 * PATCH - /api/student/:sid
 * Required values: sid, name
 * Optional values: none
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
studentsController.patchStudentById = async (req, res) => {
    const student = await studentsService.patchStudentById(req.body);
    functions.send_result(req, res, student);
};


module.exports = studentsController;
