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
coursesController.getCourses = async (req, res) => {
    const courses = await coursesService.getCourses(req);
    functions.send_result(req, res, courses);
};

/**
 * Get course by course id
 * GET - /api/course/:cid
 * Required values: cid
 * Optional values: none
 * Success: status 200 - OK and list of course data
 * Error: status 404 - Not Found and error message
 */
coursesController.getCourseById = async (req, res) => {
    const course = await coursesService.getCourseById(req);
    functions.send_result(req, res, course);
};

/**
 * Create new course
 * POST - /api/course
 * Required values: name, teacher
 * Optional values: none
 * Success: status 201 - Created and list of created course data
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
coursesController.postCourse = async (req, res) => {
    const course = await coursesService.postCourse(req);
    functions.send_result(req, res, course, 201);
};

/**
 * Add student to the course
 * POST - /api/course/:cid
 * Required values: student_id OR student_firstname AND student_lastname
 * Optional values: student_id, student_firstname, student_lastname
 * Success: status 204 - No Content
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
 coursesController.postCourseById = async (req, res) => {
    const course = await coursesService.postCourseById(req);
    functions.send_result(req, res, course, 204);
};

/**
 * Remove student from course
 * DELETE - /api/course
 * Required values: course_id, student_id OR student_firstname AND student_lastname
 * Optional values: student_id, student_firstname, student_lastname
 * Success: status 204 - No Content
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
 coursesController.deleteCourseStudent = async (req, res) => {
    const course = await coursesService.deleteCourseStudent(req.body);
    functions.send_result(req, res, course, 204);
};

/**
 * Delete course by course id
 * DELETE - /api/course/:cid
 * Required values: cid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 403 - Forbidden and errror message
 * Error: status 404 - Not Found and error message
 */
coursesController.deleteCourseById = async (req, res) => {
    const course = await coursesService.deleteCourseById(req.params.cid);
    functions.send_result(req, res, course, 204);
};

/**
 * Update course by course id
 * PATCH - /api/course/:cid
 * Required values: cid, teacher_id OR teacher
 * Optional values: teacher_id, teacher, students
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
coursesController.patchCourseById = async (req, res) => {
    const course = await coursesService.patchCourseById(req);
    functions.send_result(req, res, course);
};


module.exports = coursesController;
