
exports.teachers = [
    {
        id: 1,
        name: 'Juku Juurikas'
    },
    {
        id: 2,
        name: 'Mihkel Kukk'
    },
];

exports.students = [
    {
        id: 1,
        name: 'Mari Maasikas'
    },
    {
        id: 2,
        name: 'Uuno Lepp'
    },
    {
        id: 3,
        name: 'Mari Mustikas'
    },
];

exports.courses = [
    {
        id: 1,
        name: 'Programmeerimine',
        teacher_id: 1,
        students: [1, 2]
    },
    {
        id: 2,
        name: 'Andmebaasid',
        teacher_id: 2,
        students: [1, 2, 3]
    },
];

exports.grades = [
    {
        sid: 1,
        grades: [
            {
                course_id: 1,
                grades: ['B', 'A', 'C', 'B']
            },
            {
                course_id: 2,
                grades: ['C', 'C', 'B', 'C']
            }
        ]
    },
    {
        sid: 2,
        grades: [
            {
                course_id: 1,
                grades: ['A', 'A', 'C', 'A']
            },
            {
                course_id: 2,
                grades: ['B', 'B', 'A', 'B']
            }
        ]
    },
    {
        sid: 3,
        grades: [
            {
                course_id: 1,
                grades: ['A', 'A', 'E', 'C', 'B']
            },
            {
                course_id: 2,
                grades: ['B', 'B', 'A', 'A']
            }
        ]
    },
];
