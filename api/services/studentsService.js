const { getUserLoginData, postUser } = require('./usersService');
const db = require('../db');
const { db_error } = require('../functions');

const studentsService = {};


studentsService.getStudents = async (req) => {
    let query = ['SELECT * FROM students WHERE id=$1::int', [req.userId]];
    if (req.userGroup === 'Admin' || req.userRole === 'Teacher') query = ['SELECT * FROM students'];

    try {
        const result = await db.query(...query);
        const students = result?.rows ?? [];
        return {students};
    }
    catch (err) { return db_error('getStudents', err); }
};

studentsService.getStudentById = async (sid) => {
    try {
        const result = await db.query( db.format('SELECT * FROM students WHERE id=%L', sid) );
        const student = result?.rows[0] ?? {id:0};
        return {student};
    }
    catch (err) { return db_error('getStudentById', err); }
};

studentsService.postStudent = async (newStudent) => {
    return await postUser(newStudent, 'postStudent');
};

studentsService.deleteStudentById = async (sid) => {
    try {
        const student = await db.query( db.format('SELECT * FROM student_delete(%L)', sid) );
        if (!student?.rows[0]?.student_delete)
            return {error: '400 Bad Request', message: 'Student is in at least one course'}

        return true;
    }
    catch (err) { return db_error('deleteStudentById', err); }
};

studentsService.patchStudentById = async (student) => {
    const student_old_data = (await studentsService.getStudentById(student.sid)).student;
    const student_pwd = (await getUserLoginData(student_old_data.email)).password;

    const {
        uid, firstname = student_old_data.firstname, lastname = student_old_data.lastname,
        password:pwd, email = student_old_data.email } = student;

    if (!pwd) password = student_pwd;
    else password = await bcrypt.hash(pwd, saltRounds);

    const usr = [uid, firstname, lastname, email, password, 'Student', 'User'];
    try {
        const id = await db.query( db.format('SELECT user_patch(%L, %L, %L, %L, %L, %L, %L)', ...usr) );

        if (!id?.rows[0]?.user_patch) return {error: '400 Bad Request', message: 'All data was same, nothing changed'};
        else return {student_old_data, student_new_data: {firstname, lastname, email, password: '*****'}}
    }
    catch (err) { return db_error('patchStudentById', err); }
};


module.exports = studentsService;
