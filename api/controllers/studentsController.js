const functions = require('../functions');
const { studentsService } = require('../services');

const studentsController = {};


/**
 * Get all students
 * GET - /api/student
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of students
 */
studentsController.getStudents = (req, res) => {
    const students = studentsService.getStudents();
    res.status(200).json({students});
};

/**
 * Get student by student id
 * GET - /api/student/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 200 - OK and list of student data
 * Error: status 404 - Not Found and error message
 */
studentsController.getStudentById = (req, res) => {
    const student = studentsService.getStudentById(req.params.sid);
    functions.send_result(req, res, student);
};

/**
 * Create new student
 * POST - /api/student
 * Required values: name
 * Optional values: none
 * Success: status 201 - Created and id of created student
 * Error: status 400 - Bad Request and error message
 */
studentsController.postStudent = (req, res) => {
    const student = studentsService.postStudent(req.body.name);
    functions.send_result(req, res, student, 201);
};

/**
 * Delete student by student id
 * DELETE - /api/student/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 404 - Not Found and error message
 */
studentsController.deleteStudentById = (req, res) => {
    const student = studentsService.deleteStudentById(req.params.sid);
    functions.send_result(req, res, student, 204, true);
};

/**
 * Update student by student id
 * PATCH - /api/student/:sid
 * Required values: sid, name
 * Optional values: none
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 */
studentsController.patchStudentById = (req, res) => {
    const student = studentsService.patchStudentById(req.params.sid, req.body.name);
    functions.send_result(req, res, student);
};


module.exports = studentsController;
