
-- +--------------------------------------------+ --
-- |  Works in PostgreSQL v9.3;                 | --
-- |  some data types not supported by MySQL    | --
-- |                                            | --
-- |  @author: Jüri Kormik                      | --
-- +--------------------------------------------+ --


-- Table for user role
CREATE TABLE IF NOT EXISTS "role" (
    id SERIAL PRIMARY KEY,
    "name" varchar(16) UNIQUE NOT NULL CHECK ("name" <> '')
);
INSERT INTO "role" ("name") VALUES ('Teacher');
INSERT INTO "role" ("name") VALUES ('Student');
INSERT INTO "role" ("name") VALUES ('Guest');

-- Table for user group
CREATE TABLE IF NOT EXISTS "group" (
    id SERIAL PRIMARY KEY,
    "name" varchar(16) UNIQUE NOT NULL CHECK ("name" <> '')
);
INSERT INTO "group" ("name") VALUES ('Admin');
INSERT INTO "group" ("name") VALUES ('User');

-- Table for users
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    firstname varchar(64) NOT NULL CHECK (firstname <> ''),
    lastname varchar(64) NOT NULL CHECK (lastname <> ''),
    email varchar(64) UNIQUE NOT NULL CHECK (email <> ''),
    "password" varchar(255) UNIQUE NOT NULL CHECK ("password" <> ''),
    role_id INT NOT NULL,
    group_id INT NOT NULL,
    valid BOOLEAN DEFAULT TRUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES "role" (id),
    FOREIGN KEY (group_id) REFERENCES "group" (id)
);

-- Table for course
CREATE TABLE IF NOT EXISTS course (
    id SERIAL PRIMARY KEY,
    "name" varchar(64) NOT NULL CHECK ("name" <> ''),
    "session" varchar(64) NOT NULL CHECK ("session" <> ''),
    teacher_id INT NOT NULL,
    valid BOOLEAN DEFAULT TRUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (teacher_id) REFERENCES "user" (id)
);

-- Table for students in course
CREATE TABLE IF NOT EXISTS course_student (
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    in_course BOOLEAN DEFAULT TRUE,
    added DATE DEFAULT CURRENT_DATE,
    removed DATE DEFAULT NULL,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES course (id),
    FOREIGN KEY (student_id) REFERENCES "user" (id)
);

-- Table for student grades
CREATE TABLE IF NOT EXISTS student_grade (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade VARCHAR(8) NOT NULL CHECK (grade <> ''),
    valid BOOLEAN DEFAULT TRUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES "user" (id),
    FOREIGN KEY (course_id) REFERENCES course (id)
);


-- -----------------------------------------------------------------------------
-- Some views to get data
-- -----------------------------------------------------------------------------

CREATE VIEW users AS
    SELECT u.id, u.firstname, u.lastname, u.email, r.name AS "role", g.name AS "group", u.created
    FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    LEFT JOIN "group" AS g ON u.group_id = g.id
    WHERE valid = TRUE
    ORDER BY u.id;

CREATE VIEW user_login AS
    SELECT u.id, u.email, u.password, r.name AS "role", g.name AS "group"
    FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    LEFT JOIN "group" AS g ON u.group_id = g.id
    WHERE valid = TRUE;

CREATE VIEW teachers AS
    SELECT u.id, u.firstname, u.lastname, u.email, g.name AS "group"
    FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    LEFT JOIN "group" AS g ON u.group_id = g.id
    WHERE valid = TRUE AND r.name='Teacher'
    ORDER BY u.id;

CREATE VIEW students AS
    SELECT u.id, u.firstname, u.lastname, u.email
    FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    WHERE valid = TRUE AND r.name='Student'
    ORDER BY u.id;

CREATE VIEW courses AS
    SELECT c.id, c.name, c.session, concat(u.firstname, ' ', u.lastname) AS teacher
    FROM course AS c
    LEFT JOIN "user" AS u ON c.teacher_id = u.id
    WHERE c.valid = TRUE
    ORDER BY c.id;

CREATE VIEW all_grades AS
    SELECT sg.id, sg.student_id, concat(u.firstname, ' ', u.lastname) AS student_name, sg.course_id, c.name AS course_name, sg.grade
    FROM student_grade AS sg
    LEFT JOIN "user" AS u ON sg.student_id = u.id
    LEFT JOIN course AS c ON sg.course_id = c.id
    WHERE sg.valid=TRUE
    ORDER BY sg.id, sg.student_id, sg.course_id;


-- -----------------------------------------------------------------------------
-- Some functins to save or change data;
-- probably doesn't work in MySQL
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION user_add (fname text, lname text, email text, pwd text, u_role text, u_group text)
RETURNS integer AS $$
    INSERT INTO "user" (firstname, lastname, email, "password", role_id, group_id)
    VALUES (fname, lname, email, pwd,
        (SELECT id FROM "role" WHERE "name"=u_role),
        (SELECT id FROM "group" WHERE "name"=u_group))
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION user_delete (uid integer)
RETURNS integer AS $$
    UPDATE "user" SET valid=FALSE, deleted=now()
    WHERE id=uid AND uid NOT IN (SELECT teacher_id FROM course WHERE valid=TRUE)
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION user_patch (uid integer, fname text, lname text, email text, pwd text, u_role text, u_group text)
RETURNS integer AS $$
    UPDATE "user" SET firstname=fname, lastname=lname, email=email, "password"=pwd,
        role_id=(SELECT id FROM "role" WHERE "name"=u_role),
        group_id=(SELECT id FROM "group" WHERE "name"=u_group)
    WHERE id=uid
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION teachers_by_sid (sid integer)
RETURNS TABLE(id integer, firstname text, lastname text, email text, "group" text) AS $$
    SELECT u.id, u.firstname, u.lastname, u.email, g.name AS "group"
    FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    LEFT JOIN "group" AS g ON u.group_id = g.id
    WHERE valid = TRUE AND r.name='Teacher'
        AND u.id IN (SELECT teacher_id FROM course
                     WHERE valid=TRUE AND id IN (SELECT course_id FROM course_student
                                                 WHERE in_course=TRUE AND student_id=sid))
    ORDER BY u.id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION teacher_by_name (fname text, lname text)
RETURNS integer AS $$
    SELECT u.id FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    WHERE u.firstname = fname AND u.lastname = lname AND r.name = 'Teacher';
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION student_by_name (fname text, lname text)
RETURNS integer AS $$
    SELECT u.id FROM "user" AS u
    LEFT JOIN "role" AS r ON u.role_id = r.id
    WHERE u.firstname = fname AND u.lastname = lname AND r.name = 'Student';
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION student_delete (sid integer)
RETURNS integer AS $$
    UPDATE "user" SET valid=FALSE, deleted=now()
    WHERE id=sid AND sid NOT IN (SELECT student_id FROM course_student WHERE in_course=TRUE)
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_students (cid integer)
RETURNS TABLE(id integer, firstname text, lastname text) AS $$
    SELECT u.id, u.firstname, u.lastname
    FROM course_student AS cs
    LEFT JOIN "user" AS u ON cs.student_id = u.id
    WHERE in_course=TRUE AND cs.course_id = cid
    ORDER BY u.lastname, u.firstname;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_student_add (cid integer, sid integer)
RETURNS integer AS $$
    INSERT INTO course_student (course_id, student_id)
    VALUES (cid, sid)
    RETURNING student_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_student_remove (cid integer, sid integer)
RETURNS integer AS $$
    UPDATE course_student SET in_course=FALSE, removed=now()
    WHERE course_id = cid AND student_id = sid
    RETURNING student_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_students_remove (cid integer)
RETURNS integer AS $$
    UPDATE course_student SET in_course=FALSE, removed=now()
    WHERE course_id=cid
    RETURNING course_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_add (name text, session text, tid integer)
RETURNS integer AS $$
    INSERT INTO course ("name", "session", teacher_id)
    VALUES (name, session, tid)
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_delete (cid integer)
RETURNS integer AS $$
    UPDATE course SET valid=FALSE, deleted=now()
    WHERE id=cid
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION course_patch (cid integer, name text, session text, tid integer)
RETURNS integer AS $$
    UPDATE course SET "name"=name, "session"=session, teacher_id=tid
    WHERE id=cid
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION student_grade_add (sid integer, cid integer, grade text)
RETURNS integer AS $$
    INSERT INTO student_grade (student_id, course_id, grade)
    VALUES (sid, cid, grade)
    RETURNING student_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION student_grades_delete (sid integer)
RETURNS integer AS $$
    UPDATE student_grade SET valid=FALSE, deleted=now()
    WHERE student_id = sid
    RETURNING student_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION student_grade_delete (gid integer)
RETURNS integer AS $$
    UPDATE student_grade SET valid=FALSE, deleted=now()
    WHERE id = gid
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION student_grade_patch (gid integer, new_grade text)
RETURNS integer AS $$
    UPDATE student_grade SET grade=new_grade
    WHERE id = gid
    RETURNING id;
$$ LANGUAGE SQL;
