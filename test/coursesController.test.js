const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const { api_link } = require('../config');


const test_users = {  // previously added to the database
    student:  {userId: 7, userGroup: 'User', userRole: 'Student', email: 'mihkelt@hot.ee', password: 'mihkel_tamm'},
};

const tokens = {student:null};


describe('CoursesController', function () {
    // -----------------------------------------------------------------
    /// Before login
    // -----------------------------------------------------------------

    describe(`GET ${api_link}/course`, function () {
        it('responds with array of courses object', async function () {
            const response = await request(app).get(`${api_link}/course`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
        });
    });

    describe(`GET ${api_link}/course/1}`, function () {
        it('responds with array of courses object (exactly 1 course)', async function () {
            const response = await request(app).get(`${api_link}/course/1`);
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(200);
        });
    });

    describe(`POST ${api_link}/course`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).post(`${api_link}/course`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/course/1`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app).patch(`${api_link}/course/1`).send({});
            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });


    // -----------------------------------------------------------------
    /// Logging in
    // -----------------------------------------------------------------

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
    /// Logged in as student
    // -----------------------------------------------------------------

    describe(`POST ${api_link}/course  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .post(`${api_link}/course`).send({})
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`PATCH ${api_link}/course/1  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .patch(`${api_link}/course/1`).send({})
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });

    describe(`DELETE ${api_link}/course/1  @Student`, function () {
        it('responds with error message in json and statusCode 403', async function () {
            const response = await request(app)
                    .delete(`${api_link}/course/1`)
                    .set('Authorization', `Bearer ${tokens.student}`);

            expect(response.body).to.be.a('object');
            expect(response.statusCode).to.equal(403);
            expect(response.body.error).to.equal('403 Forbidden');
        });
    });
});
