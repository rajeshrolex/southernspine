<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

// Authenticate user
$user = AuthHelper::getAuthenticatedUser();
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized.']);
    exit();
}

try {
    $patient_id = $_GET['patient_id'] ?? null;
    $role = $user['role'];
    $userId = $user['userId'];

    // Security check: Patients can only see their own assessments
    if ($role === 'patient' && $patient_id != $userId) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden. You can only access your own clinical records.']);
        exit();
    }

    if (!$patient_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameter: patient_id.']);
        exit();
    }

    // Fetch assessments with doctor name
    $query = "SELECT ca.*, u.name as doctor_name 
              FROM clinical_assessments ca 
              JOIN users u ON ca.doctor_id = u.id 
              WHERE ca.patient_id = ? 
              ORDER BY ca.assessment_date DESC, ca.created_at DESC";
    
    $assessments = Database::fetchAll($query, [$patient_id]);

    // Decode JSON content before returning
    foreach ($assessments as &$a) {
        $a['content'] = json_decode($a['content'], true);
    }

    echo json_encode($assessments);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
