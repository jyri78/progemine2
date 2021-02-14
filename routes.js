const data = require('./data');


// Abifunktsioon õpetaja/õpilase ID leidmiseks
const _get_id = (obj, name) => {
    let result = 0;
    obj.forEach(o => {
        if (o.name == name) result = o.id;
    });
    return result;
};

// Abifunktsioon kursuse andmete väljastamiseks
const _get_course = (cid) => {
    const course = data.courses[cid];
    const teacher = data.teachers[course.teacher_id - 1].name;
    const students = [];
    course.students.forEach((student) => {
        students.push(data.students[student - 1].name);
    });
    return {
        course_id: course.id,
        teacher: teacher,
        students: students
    };
};


exports.get_teacher_tid = (req, res) => {
    const tid = req.params.tid - 1;
    if (!data.teachers[tid]) this.default(req, res);
    else
        res.status(200).json({
            teacher: data.teachers[tid]
        });
};

exports.patch_teacher_tid = (req, res) => {
    const tid = req.params.tid - 1;
    if (!data.teachers[tid]) this.default(req, res);
    else {
        const name = req.body.name;
        if (!name) res.status(400).json({error: '400 Bad Request', message: 'Name is missing'});
        else {
            const old_name = data.teachers[tid].name;
            data.teachers[tid].name = name;
            res.status(200).json({
                tid: req.params.tid,
                old_name: old_name,
                new_name: name
            });
        }
    }
};

exports.delete_teacher_tid = (req, res) => {
    const tid = req.params.tid - 1;
    if (!data.teachers[tid]) this.default(req, res);
    else {
        data.teachers.splice(tid, 1);
        res.status(200).end();
    }
};


exports.get_teacher = (req, res) => {
    res.status(200).json({
        teachers: data.teachers
    });
};

exports.post_teacher = (req, res) => {
    const name = req.body.name;
    if (!name) res.status(400).json({error: '400 Bad Request', message: 'Name is missing'});
    else {
        const id = data.teachers.length + 1;
        data.teachers.push({
            id: id,
            name: name 
        });
        res.status(201).json({id: id});
    }
};


exports.get_student_sid = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.students[sid]) this.default(req, res);
    else
        res.status(200).json({
            student: data.students[sid]
        });
};

exports.patch_student_sid = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.students[sid]) this.default(req, res);
    else {
        const name = req.body.name;
        if (!name) res.status(400).json({error: '400 Bad Request', message: 'Name is missing'});
        else {
            const old_name = data.students[sid].name;
            data.students[sid].name = name;
            res.status(200).json({
                sid: req.params.sid,
                old_name: old_name,
                new_name: name
            });
        }
    }
};

exports.delete_student_sid = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.students[sid]) this.default(req, res);
    else {
        data.students.splice(sid, 1);
        res.status(200).end();
    }
};


exports.get_student = (req, res) => {
    res.status(200).json({
        students: data.students
    });
};

exports.post_student = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.students[sid]) this.default(req, res);
    else {
        const id = data.students.length + 1;
        data.students.push({
            id: id,
            name: name 
        });
        res.status(201).json({id: id});
    }
};


exports.get_course_cid = (req, res) => {
    const cid = req.params.cid - 1;
    if (!data.courses[cid]) this.default(req, res);
    else 
        res.status(200).json({
            course: _get_course(cid)
        });
};

exports.patch_course_cid = (req, res) => {
    const cid = req.params.cid - 1;
    if (!data.courses[cid]) this.default(req, res);
    else {
        let name = data.courses[cid].name;
        if (req.body.name) name = req.body.name;

        // Lubab õpetaja info ära jätta, siis jääb samaks,
        // aga kui õpetajat andmebaasis ei ole, siis aktsepteerib ainult nime
        let tid = data.courses[cid].teacher_id;
        if (req.body.teacher_id || req.body.teacher) {
            tid = req.body.teacher_id;
            if (!tid) tid = _get_id(data.teachers, req.body.teacher);
            else if (!data.teachers[tid - 1]) tid = 0;  // ei luba kehtetut ID-d

            if (!tid && req.body.teacher) {  // uus õpetaja (eeldab, et sisestataks nimi)
                tid = data.teachers.length + 1;
                data.teachers.push({
                    id: tid,
                    name: req.body.teacher
                });
            }
            else res.status(400).json({error: '400 Bad Request', message: 'No acceptable teacher data is given'});
        }

        let student_ids = [];
        if (req.body.students) req.body.students.forEach(student => {
            let sid = _get_id(data.students, student);
            if (!sid) {
                if (isNaN(parseInt(student))) {
                    sid = data.students.length + 1;
                    data.students.push({
                        id: sid,
                        name: student
                    });
                }
            }
            if (sid) student_ids.push(sid);
        });
        else student_ids = data.courses[cid].students;

        data.courses[cid] = {
            id: req.params.cid,
            name: name,
            teacher_id: tid,
            students: student_ids
        }
        res.status(200).json({
            course: _get_course(cid)
        });
    }
};

exports.delete_course_cid = (req, res) => {
    const cid = req.params.cid - 1;
    if (!data.courses[cid]) this.default(req, res);
    else {
        data.courses.splice(cid, 1);
        res.status(200).end();
    }
};


exports.get_course = (req, res) => {
    const result = [];
    data.courses.forEach(course => {
        const teacher = data.teachers[course.teacher_id - 1].name;
        const students = [];
        course.students.forEach((student) => {
            students.push(data.students[student - 1].name);
        });
        result.push({
            course_id: course.id,
            teacher: teacher,
            students: students
        });
    });
    res.status(200).json({
        courses: result
    });
};

exports.post_course = (req, res) => {
    // Kursuse nimi ja õpetaja kohustuslik
    if (!req.body.name) res.status(400).json({error: '400 Bad Request', message: 'Name is missing'});
    if (!req.body.teacher) res.status(400).json({error: '400 Bad Request', message: 'Teacher is missing'})

    const name = req.body.name;
    const teacher = req.body.teacher;
    const new_id = data.courses.length + 1;

    // Lubab õpetaja info ära jätta, siis jääb samaks,
    // aga kui õpetajat andmebaasis ei ole, siis aktsepteerib ainult nime
    let tid = _get_id(data.teachers, teacher);

    if (!tid) {  // uus õpetaja
        tid = data.teachers.length + 1;
        data.teachers.push({
            id: tid,
            name: teacher
        });
    }

    let student_ids = [];
    if (req.body.students) req.body.students.forEach(student => {
        let sid = _get_id(data.students, student);
        if (!sid) {
            if (isNaN(parseInt(student))) {
                sid = data.students.length + 1;
                data.students.push({
                    id: sid,
                    name: student
                });
            }
        }
        if (sid) student_ids.push(sid);
    });

    data.courses.push({
        id: new_id,
        name: name,
        teacher_id: tid,
        students: student_ids
    });
    res.status(201).json({
        course: _get_course(new_id - 1)
    });
};


exports.get_grades_sid = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.students[sid] || !data.grades[sid]) this.default(req, res);
    else {
        const grades = data.grades[sid];
        const courses = {};
        grades.grades.forEach((grade) => {
            courses[data.courses[grade.course_id - 1].name] = grade.grades
        });
        res.status(200).json({
            sid: sid,
            student_name: data.students[sid].name,
            grades: courses
        });
    }
};

exports.patch_grades_sid = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.students[sid] || !data.grades[sid]) this.default(req, res);
    else {
        // Selle osa jätab järgmiseks korraks :)
        res.status(200).json({
            message: 'Andmed muudetud',
            data: req.body
        });
    }
};

exports.delete_grades_sid = (req, res) => {
    const sid = req.params.sid - 1;
    if (!data.grades[sid]) this.default(req, res);
    else {
        data.grades.splice(sid, 1);
        res.status(200).end();
    }
};


exports.get_grades = (req, res) => {
    const result = [];
    data.grades.forEach(grades => {
        const student = data.students[grades.sid - 1].name;
        const courses = {};
        grades.grades.forEach((grade) => {
            courses[data.courses[grade.course_id - 1].name] = grade.grades
        });
        result.push({sid: grades.sid, student_name: student, grades: courses});
    });
    res.status(200).json({
        grades: result
    });
};

exports.post_grades = (req, res) => {
    // Selle osa jätab järgmiseks korraks :)
    res.status(201).json({
        message: 'Andmed lisatud',
        data: req.body
    });
};

exports.default = (req, res) => {
    res.status(404).json({error: '404 Not Found', url: req.originalUrl, method: req.method});
}
