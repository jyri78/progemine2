const bcrypt = require('bcrypt');
const jwtService = require('./jwtService');
const database = require('../database');
const { saltRounds } = require('../../config');

const usersService = {};


usersService.getUsers = (req) => {
    if (req.userRole === 'Admin') return database.users;
    return database.users[req.userId - 1];
}

usersService.getUserById = (uid) => {
    const user = database.users.find((element) => element.id === uid);
    if (!user) return false;
    return user;
};
  
usersService.getUserByEmail = (email) => {
    const user = database.users.find((element) => element.email === email);
    if (!user) return false;
    return user;
};

usersService.postUser = async (newUser) => {
    const id = database.users.length + 1;
    const hash = await bcrypt.hash(newUser.password, saltRounds);
    const user = {
        id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: hash,
        role: 'User'
    };
    database.users.push(user);
    return id;
};

usersService.userLogin = async (user, password) => {
    const match = await bcrypt.compare(password, user.password);
    if (!match) return {error: '403 Forbidden', message: 'Wrong user password'};

    const token = await jwtService.sign(user);
    return token;
};

usersService.deleteUserById = (uid) => {
    const id = uid - 1;

    if (!database.users[id]) return false;
    database.users.splice(id, 1);
    return true;
};

usersService.patchUserById = async (user) => {
    const { uid, firstName, lastName, password, role } = user;
    const id = uid - 1;
    if (id < 1 || uid > database.users.length) return false;

    const user_prev_data = {...database.users[id]};  // clone copy
    let changed = false;

    if (firstName && firstName != database.users[id].firstName) {
        database.users[id].firstName = firstName;
        changed = true;
    }
    if (lastName && lastName != database.users[id].lastName) {
        database.users[id].lastName = lastName;
        changed = true;
    }
    if (password) {  // rights control already done
        const hash = await bcrypt.hash(password, saltRounds);
        if (hash != database.users[id].password) {
            database.users[id].password = hash;
            changed = true;
        }
    }
    if (role && role != database.users[id].role) {  // rights control already done
        database.users[id].role = role;
        changed = true;
    }
    if (!changed) return {error: '400 Bad Request', message: 'All data is same, nothing to change'};

    const user_changed_data = database.users[id];
    return { user_prev_data, user_changed_data };
};


module.exports = usersService;
