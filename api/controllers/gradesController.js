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
gradesController.getAllGrades = (req, res) => {
    const grades = gradesService.getAllGrades();
    res.status(200).json({grades});
};

/**
 * Get grades by student id
 * GET - /api/grades/:sid
 * Required values: sid
 * Optional values: none
 * Success: status 200 - OK and list of course data
 * Error: status 404 - Not Found and error message
 */
gradesController.getGradesByStudentId = (req, res) => {
    const grades = gradesService.getGradesByStudentId(req.params.sid);
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
gradesController.postGrades = (req, res) => {
    const grade = gradesService.postGrades(req.body);
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
gradesController.deleteGradesByStudentId = (req, res) => {
    const grade = gradesService.deleteGradesByStudentId(req.params.sid);
    functions.send_result(req, res, grade, 204, true);
};

/**
 * Update grades by student id
 * PATCH - /api/grades/:sid
 * Required values: sid, course_id OR course, grades
 * Optional values: course_id, course
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 */
gradesController.patchGradesByStudentId = (req, res) => {
    const grade = gradesService.patchGradesByStudentId(req.params.sid, req.body);
    functions.send_result(req, res, grade);
};


module.exports = gradesController;
