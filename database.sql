CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    report_type ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    report_date DATE NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
