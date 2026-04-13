-- PoultryGuard AI Database Schema
-- MySQL 8.0

CREATE DATABASE IF NOT EXISTS poultryguard_db;
USE poultryguard_db;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'farmer', 'vet') DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farms Table
CREATE TABLE farms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    flock_size INT,
    farm_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Flocks Table
CREATE TABLE flocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    breed VARCHAR(100),
    age_weeks INT,
    count INT,
    batch_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- 4. Image Diagnoses Table
CREATE TABLE image_diagnoses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flock_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    disease VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    severity ENUM('mild', 'moderate', 'severe') NOT NULL,
    action TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flock_id) REFERENCES flocks(id) ON DELETE CASCADE
);

-- 5. Audio Diagnoses Table
CREATE TABLE audio_diagnoses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flock_id INT NOT NULL,
    audio_path VARCHAR(500) NOT NULL,
    symptom VARCHAR(255) NOT NULL,
    disease_match FLOAT,
    urgency ENUM('low', 'medium', 'high') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flock_id) REFERENCES flocks(id) ON DELETE CASCADE
);

-- 6. Outbreak Predictions Table
CREATE TABLE outbreak_predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    infected_count INT NOT NULL,
    peak_day INT,
    total_affected INT,
    r0_value FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

-- 7. Chat Sessions Table
CREATE TABLE chat_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Chat Messages Table
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- 9. Vaccinations Table
CREATE TABLE vaccinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flock_id INT NOT NULL,
    vaccine_name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    administered_date DATE NULL,
    notes TEXT,
    status ENUM('pending', 'completed', 'overdue') DEFAULT 'pending',
    FOREIGN KEY (flock_id) REFERENCES flocks(id) ON DELETE CASCADE
);

-- 10. Medication Logs Table
CREATE TABLE medication_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flock_id INT NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (flock_id) REFERENCES flocks(id) ON DELETE CASCADE
);

-- 11. Economic Predictions Table
CREATE TABLE economic_predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    disease VARCHAR(255),
    flock_size INT,
    days_detected INT,
    projected_loss DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);
