const database = require('../database');
const functions = require('../functions');

const studentsService = {};


studentsService.getStudentById = (id) => {
    const sid = id - 1;
    if (!database.students[sid]) return false;
    else
        return {
            student: database.students[sid]
        };
};

studentsService.patchStudentById = (id, name) => {
    const sid = id - 1;
    if (!database.students[sid]) false;
    else {
        if (!name || !name.trim()) return {error: '400 Bad Request', message: 'Name is missing'};
        else {
            const old_name = database.students[sid].name;
            database.students[sid].name = name.trim();
            return {
                sid: id,
                old_name: old_name,
                new_name: name.trim()
            };
        }
    }
};

studentsService.deleteStudentById = (id) => {
    const sid = id - 1;
    if (!database.students[sid]) return false;
    else {
        database.students.splice(sid, 1);
        return true;
    }
};

studentsService.getStudents = () => {
    return {
        students: database.students
    };
};

studentsService.postStudent = (name) => {
    if (!name || !name.trim()) return {error: '400 Bad Request', message: 'Name is missing'};
    name = name.trim();
    if (functions.get_id(database.students, name))
        return {error: '400 Bad Request', message: 'Name is already in students database'};
    else {
        const id = database.students.length + 1;
        database.students.push({
            id: id,
            name: name.trim()
        });
        return {id: id};
    }
};


module.exports = studentsService;
