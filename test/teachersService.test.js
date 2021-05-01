const { expect } = require('chai');
const { teachersService } = require('../api/services');


const test_users = {  // previously added to the database
    teacher: {userId: 2, userRole: 'Teacher'},
    student:  {userId: 3, userRole: 'Student'},
};

let teachers;


describe('TeachersService', function () {
    describe('getTeachers()  @Teacher', function () {
        it('should return object of teachers objects', async function () {
            teachers = await teachersService.getTeachers(test_users.teacher);
            expect(teachers).to.be.a('object');
            expect(teachers.teachers).to.be.a('array');
        });
        it('should contain at least 2 teachers', async function () {
            expect(teachers.teachers.length).to.be.gt(1);
        });
    });

    describe('getTeachers()  @Student', function () {
        it('should return object of teacher object', async function () {
            teachers = await teachersService.getTeachers(test_users.student);
            expect(teachers).to.be.a('object');
            expect(teachers.teachers).to.be.a('array');
        });
        it('should contain exactly 1 teacher object', async function () {
            expect(teachers.teachers.length).to.equal(1);
        });
    });

    describe('getTeacherById()', function () {
        it('should return object of user object with keys', async function () {
            const teacher = await teachersService.getTeacherById(test_users.teacher.userId);
            expect(teacher).to.be.a('object');
            expect(teacher.teacher).to.be.a('object');
            expect(teacher.teacher).to.have.keys(['id', 'firstname', 'lastname', 'email', 'group']);
        });
    });
});
