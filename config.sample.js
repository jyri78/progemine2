const { logger, validators, isLoggedIn, isAdmin } = require('./api/middlewares');

const config = {
    debug: false,  // only for debugging purpose

    port: 3000,
    api_link: '/api',
    saltRounds: 10,
    jwtSecret: 'secret',
    loginTimeout: 20,   // in minutes

    database: {
        host: 'localhost',
        port: 3306,
        user: '',
        pwd: '',
        db: ''
    },

    entrypoints: {
        user: {
            login:  ['login',   [ ['post', [validators.loginUser, logger]] ]],
            uid:    [':uid',    [
                                    ['get', [isLoggedIn, isAdmin]],
                                    ['patch', [isLoggedIn, isAdmin, validators.updateUser]],
                                    ['delete', [isLoggedIn, isAdmin, validators.deleteUser, logger]]
                                ]],
            '':     ['',        [
                                    ['get', isLoggedIn],  // user gets his/her own data, Admin all users data
                                    ['post', [isLoggedIn, isAdmin, validators.createUser]],
                                    ['patch', [isLoggedIn, validators.updateUser]],
                                ]],
        },

        teacher: {
            tid:    [':tid',    [
                                    ['get', [isLoggedIn, isTeacher]],
                                    ['patch', [isLoggedIn, isAdmin, validators.updateTeacher]],
                                    ['delete', [isLoggedIn, isAdmin, logger]]
                                ]],
            '':     ['',        [
                                    ['get', [isLoggedIn, isNotGuest]],
                                    ['post', [isLoggedIn, isAdmin, validators.createTeacher]]
                                ]],
        },

        student: {
            sid:    [':sid',    [ 
                                    ['get', [isLoggedIn, isTeacher]],
                                    ['patch', [isLoggedIn, isAdmin, validators.updateStudent]],
                                    ['delete', [isLoggedIn, isAdmin, logger]] 
                                ]],
            '':     ['',        [
                                    ['get', [isLoggedIn, isNotGuest]],
                                    ['post', [isLoggedIn, isAdmin, validators.createStudent]]
                                ]],
        },

        course:  {
            cid:    [':cid',    [
                                    ['get', setLoginData],
                                    ['post', [isLoggedIn, isTeacher]],  // add student
                                    ['patch', [isLoggedIn, isTeacher]],
                                    ['delete', [isLoggedIn, isTeacher, logger]]
                                ]],
            '':     ['',        [
                                    ['get', setLoginData],
                                    ['post', [isLoggedIn, isTeacher]],
                                    ['delete', [isLoggedIn, isTeacher, logger]]  // remove student from course
                                ]],
        },

        grades:  {
            sid:    [':sid',    [
                                    ['get', [isLoggedIn, isTeacher]],
                                    ['patch', [isLoggedIn, isTeacher]],
                                    ['delete', [isLoggedIn, logger]]
                                ]],
            '':     ['',        [
                                    ['get', [isLoggedIn, isNotGuest]],
                                    ['post', [isLoggedIn, isTeacher]]
                                ]],
        }
    }
}


module.exports = config;
