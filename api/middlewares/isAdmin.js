
const isAdmin = (req, res, next) => {
    if (req.userRole !== 'Admin')
        return res.status(403).json({error: '403 Forbidden', message: 'Admin rights is required for this task'});

    next();
};


module.exports = isAdmin;
