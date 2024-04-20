-- Define user types
CREATE TYPE user_type AS ENUM ('student', 'professor');

-- Define project statuses
CREATE TYPE project_status AS ENUM ('open', 'closed', 'in_progress');

-- Define application statuses
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Define project durations
CREATE TYPE project_duration AS ENUM ("3 months", "3-6 months", ">6 months");

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  type user_type
);

-- Create projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  professor_id INT REFERENCES users(id),
  min_reqs VARCHAR[],
  start_date DATE NOT NULL,
  duration project_duration NOT NULL,
  status project_status,
  tags VARCHAR[]
);

-- Create applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(id),
  project_id INT REFERENCES projects(id),
  message TEXT NOT NULL,
  status application_status
);

-- Create skills table
CREATE TABLE user_skills (
  user_id INT PRIMARY KEY REFERENCES users(id),
  skills VARCHAR[]
);

-- Create experience table
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  company VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

-- Create members table
CREATE TABLE project_members (
  project_id INT REFERENCES projects(id),
  user_id INT REFERENCES users(id),
  PRIMARY KEY (project_id, user_id)
);