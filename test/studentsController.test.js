const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { api_link } = require('../config');


const test_users = {  // previously added to the database
    teacher:  {userId: 4, userGroup: 'User', userRole: 'Teacher', email: 'mihkelk@mail.ee', password: 'mihkel_kukk'},
    student:  {userId: 7, userGroup: 'User', userRole: 'Student', email: 'mihkelt@hot.ee', password: 'mihkel_tamm'},
    guest:  {userId: 8, userGroup: 'User', userRole: 'Guest', email: 'teele.k@mail.ee', password: 'teele_külaline'},
};

const tokens = {teacher:null, student:null, guest:null};


describe('StudentsController', function () {
    // -----------------------------------------------------------------
    /// Before login
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).get(`${api_link}/student`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`GET ${api_link}/student/${test_users.guest.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).get(`${api_link}/student/${test_users.guest.userId}`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`POST ${api_link}/student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).post(`${api_link}/student`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/student/${test_users.student.userId}`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).patch(`${api_link}/student/${test_users.student.userId}`).send({});
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

    describe(`POST ${api_link}/user/login  @Teacher`, function () {
        it('responds with token', async function () {
            const response = await request(app).post(`${api_link}/user/login`).send(test_users.teacher);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');
            tokens.teacher = response.body.token;
        });
    });


    // -----------------------------------------------------------------
    /// Logged in as student or guest
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/student  @Student`, function () {
        it('responds with array of students object (exactly 1 student)', async function () {
            const response = await request(app)
                    .get(`${api_link}/student`)
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
            expect(response.body.students).to.be.a('array');
            expect(response.body.students.length).to.equal(1);
        });
    });

    describe(`GET ${api_link}/student  @Guest`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .get(`${api_link}/student`)
                    .set('Authorization', `Bearer ${tokens.guest}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`GET ${api_link}/student/${test_users.student.userId}  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .get(`${api_link}/student/${test_users.student.userId}`)
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });


    // -----------------------------------------------------------------
    /// Logged in as teacher
    // -----------------------------------------------------------------

    describe(`POST ${api_link}/student  @Teacher`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .post(`${api_link}/student`).send({})
                    .set('Authorization', `Bearer ${tokens.teacher}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/student/${test_users.student.userId}  @Teacher`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .patch(`${api_link}/student/${test_users.student.userId}`).send({})
                    .set('Authorization', `Bearer ${tokens.teacher}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`DELETE ${api_link}/student/${test_users.student.userId}  @Teacher`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .delete(`${api_link}/student/${test_users.student.userId}`)
                    .set('Authorization', `Bearer ${tokens.teacher}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });
});
