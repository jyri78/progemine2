
const database = {
    teachers: [
        {
            id: 1,
            name: 'Juku Juurikas'
        },
        {
            id: 2,
            name: 'Mihkel Kukk'
        },
    ],

    students: [
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
    ],

    courses: [
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
    ],

    grades: [
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
    ],

    users: [
        {
            id: 1,
            firstName: 'Juku',
            lastName: 'Juurikas',
            email: 'juku@mail.ee',
            password: '$2b$13$r9HHYzSpJwXCBpyhc085a.ilbd02lHjndZWJSKjjYrtohXgBFhhEi', // jukuJuurikas11
            role: 'Admin',
        },
        {
            id: 2,
            firstName: 'Mari',
            lastName: 'Maasikas',
            email: 'marim@mail.ee',
            password: '$2b$13$zPIaFbbq6rRkR4IAQSU5aeTomE2THaeX0pMcZeCLwRNFodx7BOamW', // mari_maasikas
            role: 'User',
        },
        {
            id: 3,
            firstName: 'Jüri',
            lastName: 'Kormik',
            email: 'jyri78@tlu.ee',
            password: '$2b$13$qNOvIcamqoBC3VI6SFo5X.ANu/yqnPkZntWbIWzI8Eu4SB7Px3ihG', // minuPar00l
            role: 'Admin'
        }
    ],
};


module.exports = database;
