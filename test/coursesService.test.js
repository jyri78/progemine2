const { expect } = require('chai');
const { coursesService } = require('../api/services');


let courses;


describe('CoursesService', function () {
    describe('getCourses()', function () {
        it('should return object of courses objects', async function () {
            courses = await coursesService.getCourses();
            expect(courses).to.be.a('object');
            expect(courses.courses).to.be.a('array');
        });
        it('should contain at least 2 courses', async function () {
            expect(courses.courses.length).to.be.gt(1);
        });
    });

    describe('getCourseById()', function () {
        it('should return object of course object with keys', async function () {
            const course = await coursesService.getCourseById({params: {cid: 1}});
            expect(course).to.be.a('object');
            expect(course.course).to.be.a('object');
            expect(course.course).to.have.keys(['id', 'name', 'session', 'teacher']);
        });
    });
});
