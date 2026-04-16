<?php
require_once __DIR__ . '/../config/database.php';

try {
    echo "Seeding comprehensive demo data...\n";

    // 1. Clinics
    Database::query("INSERT INTO clinics (name, address, phone, status) VALUES 
        ('Southern Spine – Melbourne Central', 'Level 2, 211 La Trobe St, Melbourne VIC 3000', '(03) 9000 1111', 'active'),
        ('Southern Spine – Southbank', '10 Riverside Quay, Southbank VIC 3006', '(03) 9000 2222', 'active'),
        ('Southern Spine – Richmond', '459 Church St, Richmond VIC 3121', '(03) 9000 3333', 'active')
    ");
    echo "Clinics seeded.\n";

    // 2. Find the demo users
    $patient = Database::fetchOne("SELECT id FROM users WHERE email = 'patient@demo.com'");
    $doctor = Database::fetchOne("SELECT id FROM users WHERE email = 'doctor@demo.com'");
    
    if (!$patient || !$doctor) {
        die("Demo users not found. Run migrate.php first.\n");
    }

    $patient_id = $patient['id'];

    // 3. Appointments
    Database::query("INSERT INTO appointments (patient_id, doctor_name, specialty, appointment_date, appointment_time, type, status, location, notes) VALUES 
        (?, 'Doctor', 'Physiotherapy', '2026-06-15', '10:30:00', 'Follow-up Session', 'upcoming', 'Melbourne Central', 'Focus on lumbar stability'),
        (?, 'Doctor', 'Physiotherapy', '2026-06-22', '14:00:00', 'Adjustment', 'upcoming', 'Melbourne Central', ''),
        (?, 'Doctor', 'Physiotherapy', '2026-05-10', '09:00:00', 'Initial Consultation', 'completed', 'Southbank', 'Patient showing good progress'),
        (?, 'Doctor', 'Physiotherapy', '2026-05-15', '11:00:00', 'Progress Review', 'completed', 'Southbank', 'Improved mobility in cervical spine')
    ", [$patient_id, $patient_id, $patient_id, $patient_id]);
    echo "Appointments seeded.\n";

    // 4. Reports
    Database::query("INSERT INTO reports (patient_id, title, type, report_date, uploaded_by, size, category) VALUES 
        (?, 'Lumbar Spine X-Ray', 'PDF', '2026-05-10', 'Doctor', '2.4 MB', 'Imaging'),
        (?, 'Exercise Plan Phase 1', 'PDF', '2026-05-11', 'Doctor', '0.8 MB', 'Treatment'),
        (?, 'Cervical MRI Results', 'PDF', '2026-05-20', 'Doctor', '4.1 MB', 'Imaging')
    ", [$patient_id, $patient_id, $patient_id]);
    echo "Reports seeded.\n";

    echo "ALL DATA SEEDED SUCCESSFULLY!\n";

} catch (Exception $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
}
