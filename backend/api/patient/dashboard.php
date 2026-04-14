<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

// Authenticate
$user = AuthHelper::getAuthenticatedUser();
if (!$user || $user['role'] !== 'patient') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

try {
    $patient_id = $user['userId'];

    // 1. Get stats
    $totalAppointments = Database::fetchOne("SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?", [$patient_id])['count'];
    $upcomingCount = Database::fetchOne("SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND status = 'upcoming'", [$patient_id])['count'];
    $completedCount = Database::fetchOne("SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND status = 'completed'", [$patient_id])['count'];
    $reportCount = Database::fetchOne("SELECT COUNT(*) as count FROM reports WHERE patient_id = ?", [$patient_id])['count'];

    // 2. Get upcoming appointments
    $upcoming = Database::fetchAll(
        "SELECT * FROM appointments WHERE patient_id = ? AND status = 'upcoming' ORDER BY appointment_date ASC, appointment_time ASC LIMIT 5",
        [$patient_id]
    );

    // 3. Get recent reports
    $reports = Database::fetchAll(
        "SELECT * FROM reports WHERE patient_id = ? ORDER BY report_date DESC LIMIT 3",
        [$patient_id]
    );

    echo json_encode([
        'stats' => [
            'upcoming' => (int)$upcomingCount,
            'completed' => (int)$completedCount,
            'reports' => (int)$reportCount,
            'total' => (int)$totalAppointments
        ],
        'upcoming' => $upcoming,
        'reports' => $reports
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
