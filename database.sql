-- Delete database if it already exists 
DROP DATABASE IF EXISTS d2ldb471;

-- Create the database
CREATE DATABASE d2ldb471;
USE d2ldb471;

-- Create test table for now
CREATE TABLE test (
  id INT AUTO_INCREMENT,
  name VARCHAR(255),
  PRIMARY KEY (id)
);

INSERT INTO test (name) VALUES ('John'), ('Jane'), ('Doe');

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
