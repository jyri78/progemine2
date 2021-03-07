const { logger, validators, isLoggedIn, isAdmin } = require('./api/middlewares');

const config = {
    port: 3000,
    api_link: '/api',
    entrypoints: {
        user: {
            uid: [
                ':uid',
                [ 'get', 'patch', ['delete', logger] ]
            ],

            '':  [
                '',
                [ ['get', [logger, isLoggedIn]], ['post', validators.createUser] ]
            ],
        },
    },
    saltRounds: 10,
    jwtSecret: 'secret',
}


module.exports = config;
