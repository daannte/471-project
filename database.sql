-- Delete database if it already exists 
DROP DATABASE IF EXISTS d2ldb471;

-- Create the database
CREATE DATABASE d2ldb471;
USE d2ldb471;

-- Create the USER table
CREATE TABLE user (
  ucid INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(50) NOT NULL,
  role_type VARCHAR(10),
  PRIMARY KEY (ucid)
);

INSERT INTO user (ucid, full_name, email, password, role_type) VALUES 
(123456789, "Student Test", "student@test.com", "student123", NULL),
(987654321, "Professor Test", "professor@test.com", "professor123", "admin");

-- Create the COURSE table
CREATE TABLE course (
  name VARCHAR(50) NOT NULL,
  number INT NOT NULL,
  title VARCHAR(50) NOT NULL,
  PRIMARY KEY (name, number)
);


INSERT INTO course (name, number, title) VALUES 
("CPSC", 471, "Database Management"),
("MATH", 267, "Calculus II");

-- Create the SECTION table
CREATE TABLE section (
  id INT NOT NULL,
  ta_id INT,
  instr_id INT NOT NULL,
  year INT,
  semester VARCHAR(10),
  course_name VARCHAR(50),
  course_num  INT,
  PRIMARY KEY (id),
  FOREIGN KEY (course_name, course_num) REFERENCES course(name, number),
  FOREIGN KEY (ta_id) REFERENCES user(ucid),
  FOREIGN KEY (instr_id) REFERENCES user(ucid)
);

-- Create the COMPONENT table
CREATE TABLE component (
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  points DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  section_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (section_id) REFERENCES section(id)
);

-- Create the GRADE table
CREATE TABLE grade (
  ucid INT NOT NULL,
  component_id INT NOT NULL,
  points INT NOT NULL,
  PRIMARY KEY (ucid, component_id),
  FOREIGN KEY (component_id) REFERENCES component(id)
);

-- Create the GRADEs_scale table
CREATE TABLE grade_scale (
  letter VARCHAR(1) NOT NULL,
  section_id INT NOT NULL, 
  min_perc INT NOT NULL,
  max_perc INT NOT NULL,
  PRIMARY KEY (letter),
  FOREIGN KEY (section_id) REFERENCES section(id)
);

-- Create IN table
CREATE TABLE IN (
  student_id INT NOT NULL,
  section_id INT NOT NULL,
  PRIMARY KEY (student_id, section_id),
  FOREIGN KEY (section_id) REFERENCES section(id),
  FOREIGN KEY (student_id) REFERENCES user(ucid)
);