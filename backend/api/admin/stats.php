<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

$user = AuthHelper::getAuthenticatedUser();
if (!$user || $user['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

try {
    $totalPatients = Database::fetchOne("SELECT COUNT(*) as count FROM users WHERE role = 'patient'")['count'];
    $totalDoctors = Database::fetchOne("SELECT COUNT(*) as count FROM users WHERE role = 'doctor'")['count'];
    $totalAppointments = Database::fetchOne("SELECT COUNT(*) as count FROM appointments")['count'];
    $pendingAppointments = Database::fetchOne("SELECT COUNT(*) as count FROM appointments WHERE status = 'upcoming'")['count'];

    // Get recent appointments
    $recent = Database::fetchAll("SELECT a.*, u.name as patient_name FROM appointments a JOIN users u ON a.patient_id = u.id ORDER BY a.created_at DESC LIMIT 10");

    echo json_encode([
        'stats' => [
            'totalPatients' => (int)$totalPatients,
            'totalDoctors' => (int)$totalDoctors,
            'totalAppointments' => (int)$totalAppointments,
            'activeAppointments' => (int)$pendingAppointments
        ],
        'recentAppointments' => $recent
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
