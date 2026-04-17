<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

// Authenticate user
$user = AuthHelper::getAuthenticatedUser();
if (!$user || !in_array($user['role'], ['doctor', 'admin'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Only doctors and admins can add clinical assessments.']);
    exit();
}

// Check for POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Please use POST.']);
    exit();
}

// Get input data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['patient_id']) || !isset($data['assessment_date']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: patient_id, assessment_date, and content are required.']);
    exit();
}

try {
    $patient_id = $data['patient_id'];
    $doctor_id = $user['userId'];
    $assessment_date = $data['assessment_date'];
    $content = is_string($data['content']) ? $data['content'] : json_encode($data['content']);

    $query = "INSERT INTO clinical_assessments (patient_id, doctor_id, assessment_date, content) VALUES (?, ?, ?, ?)";
    Database::query($query, [$patient_id, $doctor_id, $assessment_date, $content]);

    echo json_encode([
        'success' => true,
        'message' => 'Clinical assessment saved successfully',
        'id' => Database::getInstance()->lastInsertId()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
