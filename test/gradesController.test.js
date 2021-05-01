const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { api_link } = require('../config');


const test_users = {  // previously added to the database
    student:  {userId: 7, userGroup: 'User', userRole: 'Student', email: 'mihkelt@hot.ee', password: 'mihkel_tamm'},
    guest:  {userId: 8, userGroup: 'User', userRole: 'Guest', email: 'teele.k@mail.ee', password: 'teele_külaline'},
};

const tokens = {student:null, guest:null};


describe('GradesController', function () {
    // -----------------------------------------------------------------
    /// Before login
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/grades`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).get(`${api_link}/grades`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`GET ${api_link}/grades/${test_users.student.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).get(`${api_link}/grades/${test_users.student.userId}`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`POST ${api_link}/grades`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).post(`${api_link}/grades`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/grades/${test_users.student.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).patch(`${api_link}/grades/${test_users.student.userId}`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });


    // -----------------------------------------------------------------
    /// Logging in
    // -----------------------------------------------------------------

    describe(`POST ${api_link}/user/login  @Guest`, function () {
        it('responds with token', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.guest);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');
            tokens.guest = response.body.token;
        });
    });

    describe(`POST ${api_link}/user/login  @Student`, function () {
        it('responds with token', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.student);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');
            tokens.student = response.body.token;
        });
    });


    // -----------------------------------------------------------------
    /// Logged in as student or guest
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/grades  @Student`, function () {
        it('responds with array of grades object', async function () {
            const response = await request(app)
                    .get(`${api_link}/grades`)
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(Object.keys(response.body).length).to.gt(1);
        });
    });

    describe(`GET ${api_link}/grades  @Guest`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .get(`${api_link}/grades`)
                    .set('Authorization', `Bearer ${tokens.guest}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`GET ${api_link}/grades/${test_users.student.userId}  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .get(`${api_link}/grades/${test_users.student.userId}`)
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });


    // // -----------------------------------------------------------------
    // /// Logged in as teacher
    // // -----------------------------------------------------------------

    describe(`POST ${api_link}/grades  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .post(`${api_link}/grades`).send({})
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/grades/${test_users.student.userId}  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .patch(`${api_link}/grades/${test_users.student.userId}`).send({})
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`DELETE ${api_link}/grades/${test_users.student.userId}  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .delete(`${api_link}/grades/${test_users.student.userId}`)
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });
});
