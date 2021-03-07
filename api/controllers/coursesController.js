const functions = require('../functions');
const { coursesService } = require('../services');

const coursesController = {};


/**
 * Get all courses
 * GET - /api/course
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of courses
 */
coursesController.getCourses = (req, res) => {
    const courses = coursesService.getCourses();
    res.status(200).json({courses});
};

/**
 * Get course by course id
 * GET - /api/course/:cid
 * Required values: cid
 * Optional values: none
 * Success: status 200 - OK and list of course data
 * Error: status 404 - Not Found and error message
 */
coursesController.getCourseById = (req, res) => {
    const course = coursesService.getCourseById(req.params.cid);
    functions.send_result(req, res, course);
};

/**
 * Create new course
 * POST - /api/course
 * Required values: name, teacher
 * Optional values: none
 * Success: status 201 - Created and list of created course data
 * Error: status 400 - Bad Request and error message
 */
coursesController.postCourse = (req, res) => {
    const course = coursesService.postCourse(req.body);
    functions.send_result(req, res, course, 201);
};

/**
 * Delete course by course id
 * DELETE - /api/course/:cid
 * Required values: cid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 404 - Not Found and error message
 */
coursesController.deleteCourseById = (req, res) => {
    const course = coursesService.deleteCourseById(req.params.cid);
    functions.send_result(req, res, course, 204, true);
};

/**
 * Update course by course id
 * PATCH - /api/course/:cid
 * Required values: cid, teacher_id OR teacher
 * Optional values: teacher_id, teacher, students
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 */
coursesController.patchCourseById = (req, res) => {
    const course = coursesService.patchCourseById(req.params.cid, req.body);
    functions.send_result(req, res, course);
};


module.exports = coursesController;
