const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { api_link } = require('../config');


const test_users = {  // previously added to the database
    admin: {userId: 1, userGroup: 'Admin', email: 'jyri78@tlu.ee', password: 'minuPar00l'},
    user:  {userId: 2, userGroup: 'User', email: 'juku@mail.ee', password: 'jukuJuurikas11'},
    fake:  {email: 'fake@mail.eu', password: 'fake_user'},
    missingEmail: {email: ' ', password: 'passwd123'},
    missingPwd: {email: 'mail@mail.ee', password: ' '},
    nonExistingId: 999,
    teacherId: 4,
    toDeleteId: 9
};

const new_users = {
    missingFN: {
        firstname: ' ',     // space should not pass
        lastname: 'Testija',
        email: 'mail@mail.ee',
        password: 'passwd123'
    },
    missingLN: {
        firstname: 'Teet',
        lastname: ' ',
        email: 'mail@mail.ee',
        password: 'passwd123'
    },
    missingEmail: {
        firstname: 'Teet',
        lastname: 'Testija',
        email: ' ',
        password: 'passwd123'
    },
    missingPwd: {
        firstname: 'Teet',
        lastname: 'Testija',
        email: 'mail@mail.ee',
        password: ' '
    },
    invalidEmail: {
        firstname: 'Teet',
        lastname: 'Testija',
        email: 'mail@mail',
        password: 'passwd123'
    },
    existingUser: {
        firstname: 'Teet',
        lastname: 'Testija',
        email: 'juku@mail.ee',
        password: 'passwd123'
    },
};
const tokens = {admin:null, user:null};

let users;


describe('UsersController', function () {
    // -----------------------------------------------------------------
    /// Before login
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/user`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).get(`${api_link}/user`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`GET ${api_link}/user/${test_users.user.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).get(`${api_link}/user/${test_users.user.userId}`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`POST ${api_link}/user`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).post(`${api_link}/user`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/user`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).patch(`${api_link}/user`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });


    // -----------------------------------------------------------------
    /// Logging in
    // -----------------------------------------------------------------

    describe(`POST ${api_link}/user/login  #MISSING_EMAIL`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.missingEmail);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });

    describe(`POST ${api_link}/user/login  #MISSING_PASSWORD`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.missingPwd);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });

    describe(`POST ${api_link}/user/login  #FAKE_USER`, function () {
        it('responds with error message in json and statusCode 404', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.fake);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(404);
            expect(response.body.error).to.equal('404 Not Found');
        });
    });

    describe(`POST ${api_link}/user/login  @User`, function () {
        it('responds with token', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.user);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');
            tokens.user = response.body.token;
        });
    });

    describe(`POST ${api_link}/user/login  @Admin`, function () {
        it('responds with token', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.admin);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');
            tokens.admin = response.body.token;
        });
    });


    // -----------------------------------------------------------------
    /// Logged in as user
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/user`, function () {
        it('responds with array of users object (exactly 1 user)', async function () {
            const response = await request(app)
                    .get(`${api_link}/user`)
                    .set('Authorization', `Bearer ${tokens.user}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.users).to.be.a('array');
            expect(response.body.users.length).to.equal(1);
        });
    });

    describe(`GET ${api_link}/user/${test_users.user.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .get(`${api_link}/user/${test_users.user.userId}`)
                    .set('Authorization', `Bearer ${tokens.user}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`POST ${api_link}/user`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send({})
                    .set('Authorization', `Bearer ${tokens.user}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/user`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .patch(`${api_link}/user`).send({})
                    .set('Authorization', `Bearer ${tokens.user}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });

    describe(`PATCH ${api_link}/user/${test_users.user.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .patch(`${api_link}/user/${test_users.user.userId}`).send({})
                    .set('Authorization', `Bearer ${tokens.user}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`DELETE ${api_link}/user/${test_users.user.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .delete(`${api_link}/user/${test_users.user.userId}`)
                    .set('Authorization', `Bearer ${tokens.user}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });


    // -----------------------------------------------------------------
    /// Logged in as admin
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/user`, function () {
        it('responds with array of users object (at least 2 users)', async function () {
            const response = await request(app).get(`${api_link}/user`).set('Authorization', `Bearer ${tokens.admin}`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.users).to.be.a('array');
            expect(response.body.users.length).to.gt(1);
        });
    });

    describe(`POST ${api_link}/user  #MISSING_FIRSTNAME`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send(new_users.missingFN)
                    .set('Authorization', `Bearer ${tokens.admin}`);
    
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });
    
    describe(`POST ${api_link}/user  #MISSING_LASTNAME`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send(new_users.missingLN)
                    .set('Authorization', `Bearer ${tokens.admin}`);
    
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });
    
    describe(`POST ${api_link}/user  #MISSING_EMAIL`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send(new_users.missingEmail)
                    .set('Authorization', `Bearer ${tokens.admin}`);
    
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });
    
    describe(`POST ${api_link}/user  #MISSING_PASSWORD`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send(new_users.missingPwd)
                    .set('Authorization', `Bearer ${tokens.admin}`);
    
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });
    
    describe(`POST ${api_link}/user  #INVALID_EMAIL`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send(new_users.invalidEmail)
                    .set('Authorization', `Bearer ${tokens.admin}`);
    
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
            expect(response.body.message).to.equal('Invalid email');
        });
    });
    
    describe(`POST ${api_link}/user  #USER_ALREADY_EXISTS`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .post(`${api_link}/user`).send(new_users.existingUser)
                    .set('Authorization', `Bearer ${tokens.admin}`);
    
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
            expect(response.body.message).to.equal('User does already exist');
        });
    });

    describe(`PATCH ${api_link}/user/${test_users.user.userId}`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .patch(`${api_link}/user/${test_users.user.userId}`).send({})
                    .set('Authorization', `Bearer ${tokens.admin}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });

    describe(`DELETE ${api_link}/user/${test_users.nonExistingId}`, function () {
        it('responds with error message in json and statusCode 404', async function () {
            const response = await request(app)
                    .delete(`${api_link}/user/${test_users.nonExistingId}`)
                    .set('Authorization', `Bearer ${tokens.admin}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(404);
            expect(response.body.error).to.equal('404 Not Found');
        });
    });

    describe(`DELETE ${api_link}/user/${test_users.teacherId}  @Teacher`, function () {
        it('responds with error message in json and statusCode 400', async function () {
            const response = await request(app)
                    .delete(`${api_link}/user/${test_users.teacherId}`)
                    .set('Authorization', `Bearer ${tokens.admin}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(400);
            expect(response.body.error).to.equal('400 Bad Request');
        });
    });

    /*describe(`DELETE ${api_link}/user/${test_users.toDeleteId}`, function () {
        it('responds with statusCode 204', async function () {
            const response = await request(app)
                    .delete(`${api_link}/user/${test_users.toDeleteId}`)
                    .set('Authorization', `Bearer ${tokens.admin}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(204);
        });
    });*/

});
