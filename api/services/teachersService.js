const database = require('../database');
const functions = require('../functions');

const teachersService = {};


teachersService.getTeacherById = (id) => {
    const tid = id - 1;
    if (!database.teachers[tid]) return false;
    else
        return {
            teacher: database.teachers[tid]
        };
};

teachersService.patchTeacherById = (id, name) => {
    const tid = id - 1;
    if (!database.teachers[tid]) false;
    else {
        if (!name || !name.trim()) return {error: '400 Bad Request', message: 'Name is missing'};
        else {
            const old_name = database.teachers[tid].name;
            database.teachers[tid].name = name.trim();
            return {
                tid: id,
                old_name: old_name,
                new_name: name.trim()
            };
        }
    }
};

teachersService.deleteTeacherById = (id) => {
    const tid = id - 1;
    if (!database.teachers[tid]) return false;
    else {
        database.teachers.splice(tid, 1);
        return true;
    }
};

teachersService.getTeachers = () => {
    return {
        teachers: database.teachers
    };
};

teachersService.postTeacher = (name) => {
    if (!name || !name.trim()) return {error: '400 Bad Request', message: 'Name is missing'};
    name = name.trim();
    if (functions.get_id(database.teachers, name)) return {error: '400 Bad Request', message: 'Name is already in teachers database'};
    else {
        const id = database.teachers.length + 1;
        database.teachers.push({
            id: id,
            name: name
        });
        return {id: id};
    }
};


module.exports = teachersService;
