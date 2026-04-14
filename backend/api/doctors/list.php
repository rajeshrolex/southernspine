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
    $query = "SELECT id, name, email, phone FROM users WHERE role = 'doctor' ORDER BY name ASC";
    $doctors = Database::fetchAll($query);
    
    // Add some specialization metadata if it were in the DB (for now hardcoded in response or we can add it to users table)
    $enriched = array_map(function($d) {
        $d['specialty'] = 'Health Specialist'; // Placeholder until DB updated
        return $d;
    }, $doctors);

    echo json_encode($enriched);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
