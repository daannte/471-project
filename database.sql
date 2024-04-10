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
  PRIMARY KEY (ucid)
);

INSERT INTO user (ucid, full_name, email, password) VALUES 
(12345678, "Student Test", "student@test.com", "student123"),
(30113704, "Zoe Kirsman", "zoe.kirsman@ucalgary.ca", "student123"),
(30120778, "Dante Kirsman", "dante.kirsman@ucalgary.ca", "student123"),
(30161346, "Arian Safari", "arian.safari@ucalgary.ca", "student123"),
(987654321, "Professor Test", "professor@test.com", "professor123");

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

INSERT INTO section (id, ta_id, instr_id, year, semester, course_name, course_num) VALUES 
(1, NULL, 987654321, 2024, "Winter", "CPSC", 471),
(2, NULL, 987654321, 2021, "Fall", "MATH", 267);

-- Create the COMPONENT table
CREATE TABLE component (
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  points DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  section_id INT NOT NULL,
  date DATETIME,
  PRIMARY KEY (id),
  FOREIGN KEY (section_id) REFERENCES section(id)
);

-- Create the GRADE table
CREATE TABLE grade (
  ucid INT NOT NULL,
  component_id INT NOT NULL,
  points DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (ucid, component_id),
  FOREIGN KEY (component_id) REFERENCES component(id),
  FOREIGN KEY (ucid) REFERENCES user(ucid)
);

-- Create the GRADESCALE table
CREATE TABLE grade_scale (
  section_id INT NOT NULL,
  letter VARCHAR(2) NOT NULL, 
  min_perc INT NOT NULL,
  max_perc INT NOT NULL,
  PRIMARY KEY (letter, section_id),
  FOREIGN KEY (section_id) REFERENCES section(id)
);

INSERT INTO grade_scale (section_id, letter, min_perc, max_perc) VALUES 
(1, 'A+', 95, 100),
(1, 'A', 90, 95),
(1, 'A-', 85, 90),
(1, 'B+', 80, 85),
(1, 'B', 75, 80),
(1, 'B-', 70, 75),
(1, 'C+', 65, 70),
(1, 'C', 60, 65),
(1, 'C-', 55, 60),
(1, 'D+', 50, 55),
(1, 'D', 45, 50),
(1, 'F', 0, 45),
(2, 'A+', 95, 100),
(2, 'A', 90, 95),
(2, 'A-', 86, 90),
(2, 'B+', 82, 86),
(2, 'B', 78, 82),
(2, 'B-', 74, 78),
(2, 'C+', 70, 74),
(2, 'C', 66, 70),
(2, 'C-', 62, 66),
(2, 'D+', 58, 62),
(2, 'D', 50, 58),
(2, 'F', 0, 50);


-- Create SinS table
CREATE TABLE sins  (
  student_id INT NOT NULL,
  section_id INT NOT NULL,
  PRIMARY KEY (student_id, section_id),
  FOREIGN KEY (section_id) REFERENCES section(id),
  FOREIGN KEY (student_id) REFERENCES user(ucid)
);

INSERT INTO sins (student_id, section_id) VALUES 
(12345678, 1),
(12345678, 2),
(30161346, 1),
(30161346, 2),
(30120778, 1),
(30120778, 2),
(30113704, 1);

-- Create added events table
CREATE TABLE addedEvent (
  id INT NOT NULL,
  student_id INT NOT NULL,
  date DATETIME NOT NULL,
  name VARCHAR(50) NOT NULL, 
  PRIMARY KEY (id),
  FOREIGN KEY (student_id) REFERENCES user(ucid)
);
