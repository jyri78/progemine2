const bcrypt = require('bcrypt');
const jwtService = require('./jwtService');
const db = require('../db');
const { db_error } = require('../functions');
const { saltRounds } = require('../../config');

const usersService = {};


usersService.getUsers = async (req) => {
    let query = ['SELECT * FROM users WHERE id=$1::int', [req.userId]];
    if (req.userGroup === 'Admin') query = ['SELECT * FROM users'];

    try {
        const result = await db.query(...query);
        const users = result?.rows ?? [];
        return {users};
    }
    catch (err) { return db_error('getUsers', err); }
}

usersService.getUserById = async (uid) => {
    try {
        const result = await db.query( db.format('SELECT * FROM users WHERE id=%L', uid) );
        const user = result?.rows[0] ?? {id:0};
        return {user};
    }
    catch (err) { return db_error('getUserById', err); }
};

usersService.getUserByEmail = async (email) => {
    try {
        const result = await db.query( db.format('SELECT * FROM users WHERE email=%L', email) );
        const user = result?.rows[0] ?? {id:0};
        return {user};
    }
    catch (err) { return db_error('getUserByEmail', err); }
};

// Only for login (no users name returned)
usersService.getUserLoginData = async (email) => {
    try {
        const user = await db.query( db.format('SELECT * FROM user_login WHERE email=%L', email) );
        return user?.rows[0] ?? false;
    }
    catch (err) { return db_error('getUserLoginData', err); }
};

usersService.postUser = async (newUser, funcName = 'postUser') => {
    const hash = await bcrypt.hash(newUser.password, saltRounds);
    const user = [newUser.firstname, newUser.lastname, newUser.email, hash, newUser.role, newUser.group];

    try {
        const id = await db.query( db.format('SELECT user_add(%L, %L, %L, %L, %L, %L)', ...user) );
        return { id: id?.rows[0]?.user_add ?? -1 };
    }
    catch (err) { return db_error(funcName, err); }
};

usersService.userLogin = async (user, password) => {
    const match = await bcrypt.compare(password, user.password);
    if (!match) return {errCode: 403, error: '403 Forbidden', message: 'Wrong user password'};

    const token = await jwtService.sign(user);
    return {token};
};

usersService.deleteUserById = async (uid, funcName = 'deleteUserById') => {
    const usr = await usersService.getUserById(uid);
    if (usr.error) return usr;
    else if (!usr.user?.id)
        return {errCode: 404, error: '404 Not Found', message: 'User not found'}

    try {
        const user = await db.query( db.format('SELECT * FROM user_delete(%L)', uid) );
        if (!user?.rows[0]?.user_delete)
            return {error: '400 Bad Request', message: 'User is Teacher in at least one of courses'}
        
        return true;
    }
    catch (err) { return db_error(funcName, err); }
};

usersService.patchUserById = async (user) => {
    const user_old_data = (await usersService.getUserById(user.uid))?.user;
    const user_pwd = (await usersService.getUserLoginData(user_old_data.email))?.password;

    if (!user_old_data?.id)
        return {errCode: 404, error: '404 Not Found', message: 'User not found'}

    const {
        uid, firstname = user_old_data.firstname, lastname = user_old_data.lastname,
        pwd, email = user_old_data.email, role = user_old_data.role, group = user_old_data.group } = user;

    if (!pwd) password = user_pwd;
    else password = await bcrypt.hash(pwd, saltRounds);

    const usr = [uid, firstname, lastname, email, password, role, group];
    try {
        const id = await db.query( db.format('SELECT user_patch(%L, %L, %L, %L, %L, %L, %L)', ...usr) );

        if (!id?.rows[0]?.user_patch) return {error: '400 Bad Request', message: 'All data was same, nothing changed'};
        else return {user_old_data, user_new_data: {firstname, lastname, email, password: '*****', role, group}}
    }
    catch (err) { return db_error('patchUserById', err); }
};


module.exports = usersService;
