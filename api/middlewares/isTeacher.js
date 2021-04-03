
const isTeacher = (req, res, next) => {
    if (req.userGroup !== 'Admin' && req.userRole !== 'Teacher')
        return res.status(403).json({error: '403 Forbidden', message: 'Admin or teacher rights is required for this task'});

    next();
};


module.exports = isTeacher;
