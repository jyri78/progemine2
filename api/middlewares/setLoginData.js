
const setLoginData = async (req, res, next) => {
    //process.chdir('./api/middlewares');
    const { jwtService } = require('../services');

    if (req.headers?.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const payload = await jwtService.verify(token);
        if (payload) {
            req.userId = payload.id;
            req.userRole = payload.role;
            req.userGroup = payload.group;
            if (!req.params?.uid) req.params.uid = payload.id;
        }
    }
    next();
};


module.exports = setLoginData;
