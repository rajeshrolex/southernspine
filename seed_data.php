<?php
require_once __DIR__ . '/backend/config/database.php';

try {
    echo "Seeding additional sample data...\n";

    // 1. Get or create a patient
    $patient = Database::fetchOne("SELECT id FROM users WHERE role = 'patient' LIMIT 1");
    if (!$patient) {
        $hashedPass = password_hash('test', PASSWORD_BCRYPT);
        Database::query("INSERT INTO users (name, email, password, role) VALUES ('Demo Patient', 'patient@demo.com', ?, 'patient')", [$hashedPass]);
        $patient_id = Database::getInstance()->lastInsertId();
    } else {
        $patient_id = $patient['id'];
    }

    // 2. Get or create a doctor
    $doctor = Database::fetchOne("SELECT id FROM users WHERE role = 'doctor' LIMIT 1");
    if (!$doctor) {
        $hashedPass = password_hash('test', PASSWORD_BCRYPT);
        Database::query("INSERT INTO users (name, email, password, role) VALUES ('Dr. Smith', 'doctor@demo.com', ?, 'doctor')", [$hashedPass]);
        $doctor_id = Database::getInstance()->lastInsertId();
    } else {
        $doctor_id = $doctor['id'];
    }

    // 3. Add appointments
    Database::query("INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, status) VALUES (?, ?, CURDATE(), '10:00', 'Initial Consultation', 'upcoming')", [$patient_id, $doctor_id]);
    Database::query("INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, status) VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:30', 'Follow-up', 'upcoming')", [$patient_id, $doctor_id]);
    Database::query("INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, type, status) VALUES (?, ?, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '09:00', 'Physical Therapy', 'completed')", [$patient_id, $doctor_id]);

    // 4. Add reports
    Database::query("INSERT INTO reports (patient_id, title, category, report_date, uploaded_by) VALUES (?, 'Lower Spine X-Ray', 'Imaging', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Radiology Dept')", [$patient_id]);
    Database::query("INSERT INTO reports (patient_id, title, category, report_date, uploaded_by) VALUES (?, 'General Health Check', 'Progress', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Clinic Lab')", [$patient_id]);

    echo "Sample data seeded successfully!\n";

} catch (Exception $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
}
