const database = require('../database');
const functions = require('../functions');

const studentsService = {};


studentsService.getStudentById = (sid) => {
    const student = database.students[sid - 1];

    if (!student) return false;
    return {student};
};

studentsService.patchStudentById = (sid, name) => {
    const id = sid - 1;

    if (!name?.trim()) return {error: '400 Bad Request', message: 'Name is missing'};
    else {
        const old_name = database.students[id]?.name;
        const new_name = name.trim();

        if (!old_name) return false;
        if (old_name == new_name) return {error: '400 Bad Request', message: 'Name is same, nothing to change'};

        database.students[id].name = new_name;
        return {sid, old_name, new_name};
    }
};

studentsService.deleteStudentById = (sid) => {
    const id = sid - 1;

    if (!database.students[id]) return false;
    else database.students.splice(id, 1);
    return true;
};

studentsService.getStudents = () => {
    const students = database.students;
    return {students};
};

studentsService.postStudent = (name) => {
    name = name?.trim();

    if (!name) return {error: '400 Bad Request', message: 'Name is missing'};

    if (functions.get_id(database.students, name))
        return {error: '400 Bad Request', message: 'Name is already in students database'};
    else {
        const id = database.students.length + 1;

        database.students.push({id, name});
        return {id};
    }
};


module.exports = studentsService;
