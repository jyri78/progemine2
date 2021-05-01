const { expect } = require('chai');
const { studentsService } = require('../api/services');


const test_users = {  // previously added to the database
    teacher: {userId: 4, userRole: 'Teacher'},
    student:  {userId: 7, userRole: 'Student'},
};

let students;


describe('StudentsService', function () {
    describe('getStudents()  @Teacher', function () {
        it('should return object of students objects', async function () {
            students = await studentsService.getStudents(test_users.teacher);
            expect(students).to.be.a('object');
            expect(students.students).to.be.a('array');
        });
        it('should contain at least 2 students', async function () {
            expect(students.students.length).to.be.gt(1);
        });
    });

    describe('getStudents()  @Student', function () {
        it('should return object of student object', async function () {
            students = await studentsService.getStudents(test_users.student);
            expect(students).to.be.a('object');
            expect(students.students).to.be.a('array');
        });
        it('should contain exactly 1 student object', async function () {
            expect(students.students.length).to.equal(1);
        });
    });

    describe('getStudentById()', function () {
        it('should return object of user object with keys', async function () {
            const student = await studentsService.getStudentById(test_users.student.userId);
            expect(student).to.be.a('object');
            expect(student.student).to.be.a('object');
            expect(student.student).to.have.keys(['id', 'firstname', 'lastname', 'email']);
        });
    });
});
