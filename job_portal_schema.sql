CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employer', 'seeker') NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    employer_id INT,
    approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (employer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    user_id INT,
    resume TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, role) VALUES
  ('admin', 'admin123', 'admin'),
  ('Prachi', 'pass123', 'employer'),
  ('Manali', 'pass456', 'employer'),
  ('Nikhil', 'alicepwd', 'seeker'),
  ('Farhaan', 'bobpwd', 'seeker');

INSERT INTO jobs (title, description, employer_id, approved) VALUES 
  ('Frontend Developer', 'Develop responsive websites using HTML, CSS, JS.', 2, 1),
  ('Backend Node.js Developer', 'Build REST APIs and handle database operations.', 2, 0),
  ('UI/UX Designer', 'Design clean and user-friendly interfaces.', 3, 1),
  ('Data Analyst', 'Analyze job trends and prepare reports.', 3, 0);

INSERT INTO applications (job_id, user_id, resume, status) VALUES 
  (1, 4, 'Alice resume text here...', 'pending'),
  (3, 5, 'Bob resume text here...', 'accepted'),
  (1, 5, 'Bob applying to frontend developer...', 'rejected');
