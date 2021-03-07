const jwt = require('jsonwebtoken');
//const { jwtSecret } = require('../../config');


const jwtService = {};

jwtService.verify = async (token) => {
    //process.chdir('./api/middlewares');
    const { jwtSecret } = require('../../config');

    try {
        const payload = await jwt.verify(token, jwtSecret);
        return payload;
    } catch (error) {
        return false;
    }
};


module.exports = jwtService;
