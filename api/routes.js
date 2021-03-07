const {
    usersController, teachersController, studentsController, coursesController, gradesController 
} = require('./controllers');

const routes_data = {
    keys: ['user', 'teacher', 'student', 'course'],
    ids: ['uid', 'tid', 'sid', 'cid'],
    names: ['User', 'Teacher', 'Student', 'Course'],
    controllers: [usersController, teachersController, studentsController, coursesController]
};


// User, Teacher, Student and Course routes
routes_data['keys'].forEach((key, index) => {
    const id = routes_data['ids'][index];
    const name = routes_data['names'][index];
    const controller = routes_data['controllers'][index];

    exports[`get_${key}_${id}`] = controller[`get${name}ById`];
    exports[`patch_${key}_${id}`] = controller[`patch${name}ById`];
    exports[`delete_${key}_${id}`] = controller[`delete${name}ById`];
    exports[`get_${key}`] = controller[`get${name}s`];
    exports[`post_${key}`] = controller[`post${name}`];
});

// User login routers
exports.post_user_login = usersController.userLogin;

// Grades routes (different from others)
exports.get_grades_sid = gradesController.getGradesByStudentId;
exports.patch_grades_sid = gradesController.patchGradesByStudentId;
exports.delete_grades_sid = gradesController.deleteGradesByStudentId;

exports.get_grades = gradesController.getAllGrades;
exports.post_grades = gradesController.postGrades;


// Default route (Not Fount error)
exports.default = (req, res) => {
    res.status(404).json({error: '404 Not Found', url: req.originalUrl, method: req.method});
}
