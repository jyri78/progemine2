const functions = require('../functions');
const coursesService = require('../services/coursesService');

const coursesController = {};


coursesController.getCourseById = (req, res) => {
    const course = coursesService.getCourseById(req.params.cid);
    functions.send_result(req, res, course);
};

coursesController.patchCourseById = (req, res) => {
    const course = coursesService.patchCourseById(req.params.cid, req.body);
    functions.send_result(req, res, course);
};

coursesController.deleteCourseById = (req, res) => {
    const course = coursesService.deleteCourseById(req.params.cid);
    functions.send_result(req, res, course, 204, true);
};

coursesController.getCourses = (req, res) => {
    const courses = coursesService.getCourses();
    res.status(200).json(courses);
};

coursesController.postCourse = (req, res) => {
    const course = coursesService.postCourse(req.body);
    functions.send_result(req, res, course, 201);
};


module.exports = coursesController;
