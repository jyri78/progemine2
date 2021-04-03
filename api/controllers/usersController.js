const functions = require('../functions');
const { usersService } = require('../services');

const usersController = {};


/**
 * Get all users
 * GET - /api/user
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of users
 */
usersController.getUsers = async (req, res) => {
    const users = await usersService.getUsers(req);
    functions.send_result(req, res, users);
};

/**
 * Get user by user id
 * GET - /api/user/:uid
 * Required values: id
 * Optional values: none
 * Success: status 200 - OK and user with specified id
 * Error: status 404 - Not Found and error message
 */
usersController.getUserById = async (req, res) => {
    const user = await usersService.getUserById(req.params.uid);
    functions.send_result(req, res, user);
};

/**
 * Create new user
 * POST - /api/user
 * Required values: firstName, lastName, email, password
 * Optional values: none
 * Success: status 201 - Created and id of created user
 * Error: status 400 - Bad Request and error message
 */
usersController.postUser = async (req, res) => {
    const user = await usersService.postUser(req.body);
    functions.send_result(req, res, user, 201);
};

/**
 * User login
 * POST - /api/user/login
 * Required values: email, password
 * Optional values: none
 * Success: status 200 - OK and login token
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Forbidden and errror message
 */
usersController.userLogin = async (req, res) => {
    const { user, password } = req.body;
    const token = await usersService.userLogin(user, password);
    functions.send_result(req, res, token);
};

/**
 * Delete user by user id
 * DELETE - /api/user/:uid
 * Required values: uid
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 404 - Not Found and error message
 */
usersController.deleteUserById = async (req, res) => {
    const user = await usersService.deleteUserById(req.params.uid);
    functions.send_result(req, res, user, 204);
};

/**
 * Update user by user id
 * PATCH - /api/user/:uid
 * Required values: uid, firstName OR lastName
 * Optional values: firstName, lastName
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 */
usersController.patchUserById = async (req, res) => {
    const user = await usersService.patchUserById(req.body);
    functions.send_result(req, res, user);
};


module.exports = usersController;
