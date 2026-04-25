<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

$user = AuthHelper::getAuthenticatedUser();
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

try {
    $query = "SELECT c.*, 
              (SELECT COUNT(*) FROM users u WHERE u.clinic_id = c.id AND u.role = 'doctor') as doctor_count,
              (SELECT COUNT(*) FROM users u WHERE u.clinic_id = c.id AND u.role = 'patient') as patient_count
              FROM clinics c 
              ORDER BY c.name ASC";
    
    $clinics = Database::fetchAll($query);
    echo json_encode($clinics);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
