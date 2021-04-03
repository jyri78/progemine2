const validators = {};

validators.createUser = async (req, res, next) => {
    //process.chdir('./api/middlewares');
    const { getUserByEmail } = require('../services/usersService');
    const roles = ['Teacher', 'Student', 'Guest'];
    const groups = ['Admin', 'User'];
    let { firstname, lastname, email, password, role, group } = req.body;
    firstname = firstname?.trim();
    lastname = lastname?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!firstname || !lastname || !email || !password)
        return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname, email or password is missing'});

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))  // just basic validation (not RFC 2822 standard)
        return res.status(400).json({error: '400 Bad Request', message: 'Invalid email'});

    const user_check = await getUserByEmail(email);
    if (user_check?.user)
        return res.status(400).json({error: '400 Bad Request', message: 'User does already exist'});

    if (roles.indexOf(role) == -1) role = 'Guest';
    if (groups.indexOf(group) == -1) group = 'User';
    if (role === 'Student') group = 'User';  // Student can't be Admin :)

    req.body = [];  // reset body (ignore all other data)
    req.body.firstname = firstname;
    req.body.lastname = lastname;
    req.body.email = email;
    req.body.password = password;
    req.body.role = role;
    req.body.group = group;
    next();
};

validators.loginUser = async (req, res, next) => {
    const { getUserLoginData } = require('../services/usersService');
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    if (!email || !password)
        return res.status(400).json({error: '400 Bad Request', message: 'Email or password is missing'});

    const user = await getUserLoginData(email);
    if (!user)
        return res.status(404).json({error: '404 Not Found', message: 'User not found'});

    req.body = [];  // reset body (ignore all other data)
    req.body.user = user;
    req.body.password = password;
    next();
};

validators.deleteUser = async (req, res, next) => {
    const { getUserById } = require('../services/usersService');

    const user = await getUserById(req.params.uid);
    if (!user)
        return res.status(404).json({error: '404 Not Found', message: 'User not found'});

    next();
};

validators.updateUser = async (req, res, next) => {
    let { firstname, lastname, password, email, role, group } = req.body;
    let uid = req.params?.uid ?? 0;
    const { getUserByEmail } = require('../services/usersService');
    const roles = ['Teacher', 'Student', 'Guest'];
    const groups = ['Admin', 'User'];
    const isUser = req.userId == uid;
    const isAdmin = req.userGroup === 'Admin' && uid;
    const canChange = isUser || isAdmin;
    firstname = firstname?.trim();
    lastname = lastname?.trim();
    password = password?.trim();
    email = email?.trim();

    if (!canChange)
        return res.status(403).json({error: '403 Forbidden', message: 'You are unauthorized to change data'});

    if (isUser && !firstname && !lastname && !password && !email) 
        return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname, password and email all are missing'});
    else if (!firstname && !lastname && !email && !role && !group)
        return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname, email, role and group all are missing'});

    if (!uid) uid = req.userId;

    if (email) {
        const user_check = await getUserByEmail(email);
        if (user_check?.user)
            return res.status(400).json({error: '400 Bad Request', message: 'Requested email is already in use'});
    }

    req.body = [];  // reset body (ignore all other data)
    req.body.uid = uid;
    req.body.firstname = firstname;
    req.body.lastname = lastname;
    if (isUser) req.body.password = password;  // only user can change password
    req.body.email = email;
    if (isAdmin) {  // only admin can change user role and user group
        if (role && roles.indexOf(role) == -1) role = 'Guest';
        if (group && groups.indexOf(group) == -1) group = 'User';
        if (role === 'Student') group = 'User';  // Student can't be Admin :)
        req.body.role = role;
        req.body.group = group;
    }

    next();
};

validators.createTeacher = async (req, res, next) => {
    req.body.role = 'Teacher';
    await validators.createUser(req, res, next);
};
validators.deleteTeacher = async (req, res, next) => {
    req.params.uid = req.params.tid;
    await validators.deleteUser(req, res, next);
};
validators.updateTeacher = async (req, res, next) => {
    const { getUserById } = require('../services/usersService');
    const user = await getUserById(req.body.tid);

    if (user.role !== 'Teacher')
        return res.status(400).json({error: '400 Bad Request', message: 'User with requested id is not teacher'});

    req.params.uid = req.params.tid;
    req.body.role = 'Teacher';  // make sure user is teacher
    await validators.updateUser(req, res, next);
};

validators.createStudent = async (req, res, next) => {
    req.body.role = 'Student';
    await validators.createUser(req, res, next);
};
validators.deleteStudent = async (req, res, next) => {
    req.params.uid = req.params.sid;
    await validators.deleteUser(req, res, next);
};
validators.updateStudent = async (req, res, next) => {
    const { getUserById } = require('../services/usersService');
    const user = await getUserById(req.body.tid);

    if (user.role !== 'Student')
        return res.status(400).json({error: '400 Bad Request', message: 'User with requested id is not student'});

    req.params.uid = req.params.sid;
    req.body.role = 'Student';  // make sure user is student
    await validators.updateUser(req, res, next);
};


module.exports = validators;
