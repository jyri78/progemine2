
const isNotGuest = (req, res, next) => {
    if (req.userGroup !== 'Admin' && req.userRole === 'Guest')
        return res.status(403).json({error: '403 Forbidden', message: 'At least Student rights is required for this task'});

    next();
};


module.exports = isNotGuest;
