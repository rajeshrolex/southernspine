<?php
require_once __DIR__ . '/../config/database.php';

try {
    echo "Starting migration...\n";

    // 1. Clinics Table (Must be first because users refer to it)
    Database::query("CREATE TABLE IF NOT EXISTS clinics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Clinics table created/verified.\n";

    // 2. Users Table
    Database::query("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('patient', 'doctor', 'admin', 'hr') DEFAULT 'patient',
        phone VARCHAR(20),
        dob DATE,
        gender VARCHAR(20),
        clinic_id INT,
        specialty VARCHAR(100),
        experience VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
    )");
    echo "Users table created/verified.\n";

    // 3. Appointments Table
    Database::query("CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT,
        doctor_name VARCHAR(100),
        specialty VARCHAR(100),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        type VARCHAR(100),
        status ENUM('upcoming', 'completed', 'cancelled', 'in-progress') DEFAULT 'upcoming',
        location VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL
    )");
    echo "Appointments table created.\n";

    // 4. Reports Table
    Database::query("CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(20) DEFAULT 'PDF',
        report_date DATE NOT NULL,
        uploaded_by VARCHAR(100),
        size VARCHAR(20),
        category VARCHAR(50),
        file_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "Reports table created.\n";

    // 5. Staff Authorization Codes Table
    Database::query("CREATE TABLE IF NOT EXISTS staff_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        usage_limit INT DEFAULT 1,
        times_used INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Staff codes table created.\n";
    
    // 6. Clinical Assessments Table
    Database::query("CREATE TABLE IF NOT EXISTS clinical_assessments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        assessment_date DATE NOT NULL,
        content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "Clinical assessments table created.\n";

    // 7. Seed codes if none exist
    $codeCount = Database::fetchOne("SELECT COUNT(*) as count FROM staff_codes")['count'];
    if ($codeCount == 0) {
        Database::query("INSERT INTO staff_codes (code, usage_limit) VALUES ('SS-STAFF-2026', 100)");
        echo "Default HR code seeded.\n";
    }

    // 7. Seed initial demo users...
    $userCount = Database::fetchOne("SELECT COUNT(*) as count FROM users")['count'];
    if ($userCount == 0) {
        $hashedPass = password_hash('test', PASSWORD_BCRYPT);
        Database::query("INSERT INTO users (name, email, password, role) VALUES 
            ('Patient', 'patient@demo.com', '$hashedPass', 'patient'),
            ('Doctor', 'doctor@demo.com', '$hashedPass', 'doctor'),
            ('Admin', 'admin@demo.com', '$hashedPass', 'admin'),
            ('HR Manager', 'hr@demo.com', '$hashedPass', 'hr')");
        
        $patient_id = Database::fetchOne("SELECT id FROM users WHERE email = 'patient@demo.com'")['id'];
        $doctor_id = Database::fetchOne("SELECT id FROM users WHERE email = 'doctor@demo.com'")['id'];

        // Seed sample appointments
        Database::query("INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, status) VALUES (?, ?, CURDATE(), '10:00', 'Initial Consultation', 'upcoming')", [$patient_id, $doctor_id]);
        Database::query("INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, status) VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:30', 'Follow-up', 'upcoming')", [$patient_id, $doctor_id]);
        Database::query("INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, status) VALUES (?, ?, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '09:00', 'Physical Therapy', 'completed')", [$patient_id, $doctor_id]);

        // Seed sample reports
        Database::query("INSERT INTO reports (patient_id, title, category, report_date, uploaded_by) VALUES (?, 'Chest X-Ray', 'Imaging', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Radiology Dept')", [$patient_id]);
        Database::query("INSERT INTO reports (patient_id, title, category, report_date, uploaded_by) VALUES (?, 'Blood Test Result', 'Progress', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Clinic Lab')", [$patient_id]);

        echo "Initial demo users seeded (password: test) with sample data.\n";
    }

    echo "Migration completed successfully!\n";

} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
