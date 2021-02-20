const teachersController = require('./controllers/teachersController');
const studentsController = require('./controllers/studentsController');
const coursesController = require('./controllers/coursesController');
const gradesController = require('./controllers/gradesController');


exports.logger = (req, res, next) => {
    console.log(new Date(), req.method, req.url);
    next();
};


// Teacher routes
exports.get_teacher_tid = teachersController.getTeacherById;
exports.patch_teacher_tid = teachersController.patchTeacherById;
exports.delete_teacher_tid = teachersController.deleteTeacherById;

exports.get_teacher = teachersController.getTeachers;
exports.post_teacher = teachersController.postTeacher;


// Student routes
exports.get_student_sid = studentsController.getStudentById;
exports.patch_student_sid = studentsController.patchStudentById;
exports.delete_student_sid = studentsController.deleteStudentById;

exports.get_student = studentsController.getStudents;
exports.post_student = studentsController.postStudent;


// Course routes
exports.get_course_cid = coursesController.getCourseById;
exports.patch_course_cid = coursesController.patchCourseById;
exports.delete_course_cid = coursesController.deleteCourseById;

exports.get_course = coursesController.getCourses;
exports.post_course = coursesController.postCourse;


// Grades routes
exports.get_grades_sid = gradesController.getGradesByStudentId;
exports.patch_grades_sid = gradesController.patchGradesByStudentId;
exports.delete_grades_sid = gradesController.deleteGradesByStudentId;

exports.get_grades = gradesController.getAllGrades;
exports.post_grades = gradesController.postGrades;


// Default route (Not Fount error)
exports.default = (req, res) => {
    res.status(404).json({error: '404 Not Found', url: req.originalUrl, method: req.method});
}
