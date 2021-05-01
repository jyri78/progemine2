const { expect } = require('chai');
const { gradesService } = require('../api/services');


const test_users = {  // previously added to the database
    teacher: {userId: 4, userRole: 'Teacher'},
    student:  {userId: 7, userRole: 'Student'},
};

let grades;


describe('GradesService', function () {
    describe('getAllGrades()  @Teacher', function () {
        it('should return object of grades objects', async function () {
            grades = await gradesService.getAllGrades(test_users.teacher);
            expect(grades).to.be.a('object');
            expect(grades.grades).to.be.a('object');
        });
        it('should contain at least 2 grades', async function () {
            expect(Object.keys(grades.grades).length).to.be.gt(1);
        });
    });

    describe('getGradesByStudentId()', function () {
        it('should return object of grades object with keys', async function () {
            const grades = await gradesService.getGradesByStudentId(test_users.student.userId);
            expect(grades).to.be.a('object');
            expect(grades).to.have.keys(['student_id', 'student_name', 'grades_by_course']);
        });
    });
});
