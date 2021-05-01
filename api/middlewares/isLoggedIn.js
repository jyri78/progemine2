
const isLoggedIn = async (req, res, next) => {
    //process.chdir('./api/middlewares');
    const { jwtService } = require('../services');

    if (!req.headers?.authorization)
        return res.status(403).json({error: '403 Forbidden', message: 'Authorization header is missing'});

    const token = req.headers.authorization.split(' ')[1];
    const payload = await jwtService.verify(token);
    if (!payload) return res.status(401).json({error: '401 Unauthorized', message: 'You are unauthorized to see/change content'});
    req.userId = payload.id;
    req.userRole = payload.role;
    req.userGroup = payload.group;
    if (!req.params?.uid) req.params.uid = payload.id;
    next();
};


module.exports = isLoggedIn;
