const validators = {};

validators.createUser = (req, res, next) => {
    //process.chdir('./api/middlewares');
    const { getUserByEmail } = require('../services/usersService');
    let { firstName, lastName, email, password } = req.body;
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!firstName || !lastName || !email || !password)
        return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname, email or password is missing'});

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))  // just basic validation (not RFC 2822 standard)
        return res.status(400).json({error: '400 Bad Request', message: 'Invalid email'});

    if (getUserByEmail(email))
        return res.status(400).json({error: '400 Bad Request', message: 'User does already exist'});

    req.body = [];  // reset body (ignore all other data)
    req.body.firstName = firstName;
    req.body.lastName = lastName;
    req.body.email = email;
    req.body.password = password;
    next();
};

validators.loginUser = (req, res, next) => {
    const { getUserByEmail } = require('../services/usersService');
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    if (!email || !password)
        return res.status(400).json({error: '400 Bad Request', message: 'Email or password is missing'});

    const user = getUserByEmail(email);
    if (!user)
        return res.status(404).json({error: '404 Not Found', message: 'User not found'});

    req.body = [];  // reset body (ignore all other data)
    req.body.user = user;
    req.body.password = password;
    next();
};

validators.updateUser = (req, res, next) => {
    let { firstName, lastName, password, role } = req.body;
    const uid = req.params.uid;
    const isUser = req.userId == uid;
    const isAdmin = req.userRole === 'Admin';
    const canChange = isUser || isAdmin;
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    password = password?.trim();
    role = role?.trim();

    if (!canChange)
        return res.status(403).json({error: '403 Forbidden', message: 'You are unauthorized to change data'});

    if (!firstName && !lastName) {
        if (isUser) {
            if (!password)
                return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname or password is missing'});
        }
        else if (isAdmin) {
            if (!role) {
                if (isUser && !password)
                    return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname, password or user role is missing'});
                else
                    return res.status(400).json({error: '400 Bad Request', message: 'Firstname, lastname or user role is missing'});
            }
        }
    }

    req.body = [];  // reset body (ignore all other data)
    req.body.uid = uid;
    req.body.firstName = firstName;
    req.body.lastName = lastName;

    // Admin can change user role, password can be changed only by user
    if (isUser) req.body.password = password;
    if (isAdmin) req.body.role = role;

    next();
};


module.exports = validators;
