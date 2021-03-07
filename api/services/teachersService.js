const database = require('../database');
const functions = require('../functions');

const teachersService = {};


teachersService.getTeachers = () => database.teachers;

teachersService.getTeacherById = (tid) => {
    const teacher = database.teachers[tid - 1];

    if (!teacher) return false;
    return {teacher};
};

teachersService.postTeacher = (name) => {
    name = name?.trim();

    if (!name) return {error: '400 Bad Request', message: 'Name is missing'};

    if (functions.get_id(database.teachers, name))
        return {error: '400 Bad Request', message: 'Name is already in teachers database'};
    else {
        const id = database.teachers.length + 1;

        database.teachers.push({id, name});
        return {id};
    }
};

teachersService.deleteTeacherById = (tid) => {
    const id = tid - 1;

    if (!database.teachers[id]) return false;
    else database.teachers.splice(id, 1);
    return true;
};

teachersService.patchTeacherById = (tid, name) => {
    const id = tid - 1;

    if (!name?.trim()) return {error: '400 Bad Request', message: 'Name is missing'};
    else {
        const old_name = database.teachers[id]?.name;
        const new_name = name.trim();

        if (!old_name) return false;
        if (old_name == new_name) return {error: '400 Bad Request', message: 'Name is same, nothing to change'};

        database.teachers[id].name = new_name;
        return {tid, old_name, new_name};
    }
};


module.exports = teachersService;
