<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

$user = AuthHelper::getAuthenticatedUser();
if (!$user || $user['role'] !== 'doctor') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

try {
    $doctor_id = $user['userId'];
    $today = date('Y-m-d');

    // 1. Get stats
    $todayCount = Database::fetchOne(
        "SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND appointment_date = ?", 
        [$doctor_id, $today]
    )['count'];

    $completedCount = Database::fetchOne(
        "SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND status = 'completed'", 
        [$doctor_id]
    )['count'];

    $upcomingCount = Database::fetchOne(
        "SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND status = 'upcoming' AND appointment_date = ?", 
        [$doctor_id, $today]
    )['count'];

    $uniquePatients = Database::fetchOne(
        "SELECT COUNT(DISTINCT patient_id) as count FROM appointments WHERE doctor_id = ?", 
        [$doctor_id]
    )['count'];

    // 2. Get today's schedule with patient names
    $appointments = Database::fetchAll(
        "SELECT a.*, u.name as patient_name 
         FROM appointments a 
         JOIN users u ON a.patient_id = u.id 
         WHERE a.doctor_id = ? AND a.appointment_date = ? 
         ORDER BY a.appointment_time ASC",
        [$doctor_id, $today]
    );

    echo json_encode([
        'stats' => [
            'today' => (int)$todayCount,
            'completed' => (int)$completedCount,
            'upcoming' => (int)$upcomingCount,
            'patients' => (int)$uniquePatients
        ],
        'appointments' => $appointments
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
