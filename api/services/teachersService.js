const { getUserLoginData, postUser, deleteUserById } = require('./usersService');
const db = require('../db');
const { db_error } = require('../functions');

const teachersService = {};


teachersService.getTeachers = async (req) => {
    let query = ['SELECT * FROM teachers WHERE id=$1::int', [req.userId]];

    if (req.userGroup === 'Admin' || req.userRole === 'Teacher') query = ['SELECT * FROM teachers'];
    else /*if (req.userRole === 'Student')*/ query = ['SELECT * FROM teachers_by_sid($1::int)', [req.userId]];

    try {
        const result = await db.query(...query);
        const teachers = result?.rows ?? {};
        return {teachers};
    }
    catch (err) { return db_error('getTeachers', err); }
};

teachersService.getTeacherById = async (tid) => {
    try {
        const result = await db.query( db.format('SELECT * FROM teachers WHERE id=%L', tid) );
        const teacher = result?.rows[0] ?? {id:0};
        return {teacher};
    }
    catch (err) { return db_error('getTeacherById', err); }
};

teachersService.postTeacher = async (newTeacher) => {
    return await postUser(newTeacher, 'postTeacher');
};

teachersService.deleteTeacherById = async (tid) => {
    return await deleteUserById(tid, 'deleteTeacherById');
};

teachersService.patchTeacherById = async (teacher) => {
    const teacher_old_data = (await teachersService.getTeacherById(teacher.tid)).teacher;
    const teacher_pwd = (await getUserLoginData(teacher_old_data.email)).password;

    const {
        uid, firstname = teacher_old_data.firstname, lastname = teacher_old_data.lastname,
        password:pwd, email = teacher_old_data.email, group = teacher_old_data.group } = teacher;

    if (!pwd) password = teacher_pwd;
    else password = await bcrypt.hash(pwd, saltRounds);

    const usr = [uid, firstname, lastname, email, password, 'Teacher', group];
    try {
        const id = await db.query( db.format('SELECT user_patch(%L, %L, %L, %L, %L, %L, %L)', ...usr) );

        if (!id?.rows[0]?.user_patch) return {error: '400 Bad Request', message: 'All data was same, nothing changed'};
        else return {teacher_old_data, teacher_new_data: {firstname, lastname, email, password: '*****', group}}
    }
    catch (err) { return db_error('patchTeacherById', err); }
};


module.exports = teachersService;
