const functions = require('../functions');
const { gradesService } = require('../services');

const gradesController = {};


/**
 * Get all grades
 * GET - /api/grades
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of grades
 */
gradesController.getAllGrades = async (req, res) => {
    const grades = await gradesService.getAllGrades(req);
    functions.send_result(req, res, grades);
};

/**
 * Get grades by student id
 * GET - /api/grades/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 200 - OK and list of course data
 * Error: status 404 - Not Found and error message
 */
gradesController.getGradesByStudentId = async (req, res) => {
    const grades = await gradesService.getGradesByStudentId(req.params.sid);
    functions.send_result(req, res, grades);
};

/**
 * Add new list of grades
 * POST - /api/grades
 * Required values: student_id OR student, course_id OR course, grades
 * Optional values: student_id, student, course_id, course
 * Success: status 201 - Created and list of created course data
 * Error: status 400 - Bad Request and error message
 */
gradesController.postGrades = async (req, res) => {
    const grade = await gradesService.postGrades(req);
    functions.send_result(req, res, grade, 201);
};

/**
 * Delete grades by student id
 * DELETE - /api/grades/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 404 - Not Found and error message
 */
gradesController.deleteGradesByStudentId = async (req, res) => {
    const grade = await gradesService.deleteGradesByStudentId(req.params.sid, req.body);
    functions.send_result(req, res, grade, 204);
};

/**
 * Update grades by student id
 * PATCH - /api/grades/:sid
 * Required values: sid, course_id OR course, grades
 * Optional values: course_id, course
 * Success: status 200 - OK and success message
 * Error: status 404 - Not Found and error message
 */
gradesController.patchGradesByStudentId = async (req, res) => {
    const grade = await gradesService.patchGradesByStudentId(req.params.sid, req.body);
    functions.send_result(req, res, grade);
};


module.exports = gradesController;
