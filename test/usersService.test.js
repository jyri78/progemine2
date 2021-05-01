const { expect } = require('chai');
const { usersService } = require('../api/services');


const test_users = {  // previously added to the database
    admin: {userId: 1, userGroup: 'Admin', email: 'jyri78@tlu.ee'},
    user:  {userId: 2, userGroup: 'User'},
};

let users;


describe('UsersService', function () {
    describe('getUsers()  @Admin', function () {
        it('should return object of users objects', async function () {
            users = await usersService.getUsers(test_users.admin);
            expect(users).to.be.a('object');
            expect(users.users).to.be.a('array');
        });
        it('should contain at least 2 users', async function () {
            expect(users.users.length).to.be.gt(1);
        });
    });

    describe('getUsers()  @User', function () {
        it('should return object of user object', async function () {
            users = await usersService.getUsers(test_users.user);
            expect(users).to.be.a('object');
            expect(users.users).to.be.a('array');
        });
        it('should contain exactly 1 user object', async function () {
            expect(users.users.length).to.equal(1);
        });
    });

    describe('getUserById()', function () {
        it('should return object of user object with keys', async function () {
            const user = await usersService.getUserById(test_users.admin.userId);
            expect(user).to.be.a('object');
            expect(user.user).to.be.a('object');
            expect(user.user).to.have.keys(['id', 'firstname', 'lastname', 'email', 'role', 'group', 'created']);
        });
    });

    describe('getUserByEmail()', function () {
        it('should return object of user object with keys', async function () {
            const user = await usersService.getUserByEmail(test_users.admin.email);
            expect(user).to.be.a('object');
            expect(user.user).to.be.a('object');
            expect(user.user).to.have.keys(['id', 'firstname', 'lastname', 'email', 'role', 'group', 'created']);
        });
    });

    describe('getUserLoginData()', function () {
        it('should return user object with keys', async function () {
            const user = await usersService.getUserLoginData(test_users.admin.email);
            expect(user).to.be.a('object');
            expect(user).to.have.keys(['id', 'email', 'password', 'role', 'group']);
        });
    });
});
