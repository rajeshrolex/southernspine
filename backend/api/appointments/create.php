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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $patient_id = $user['userId'];
    $doctor_id = $data['doctor_id'] ?? null;
    $doctor_name = $data['doctor_name'] ?? '';
    $specialty = $data['specialty'] ?? '';
    $date = $data['date'] ?? '';
    $time = $data['time'] ?? '';
    $type = $data['type'] ?? '';
    $location = $data['location'] ?? 'Spine Clinic - Level 2';
    $notes = $data['notes'] ?? '';

    if (empty($doctor_name) || empty($date) || empty($time)) {
        http_response_code(400);
        echo json_encode(['error' => 'All required fields must be provided']);
        exit();
    }

    $query = "INSERT INTO appointments (patient_id, doctor_id, doctor_name, specialty, appointment_date, appointment_time, type, status, location, notes) 
              VALUES (?, ?, ?, ?, ?, ?, ?, 'upcoming', ?, ?)";
    
    Database::query($query, [$patient_id, $doctor_id, $doctor_name, $specialty, $date, $time, $type, $location, $notes]);

    echo json_encode([
        'message' => 'Appointment booked successfully',
        'id' => Database::getInstance()->lastInsertId()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
