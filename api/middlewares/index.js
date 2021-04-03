const logger = require('./logger');
const validators = require('./validators');
const isLoggedIn = require('./isLoggedIn');
const isAdmin = require('./isAdmin');
const isTeacher = require('./isTeacher');
const isNotGuest = require('./isNotGuest');
const setLoginData = require('./setLoginData');

module.exports = {
  logger,
  validators,
  isLoggedIn,
  isAdmin,
  isTeacher,
  isNotGuest,
  setLoginData,
};
