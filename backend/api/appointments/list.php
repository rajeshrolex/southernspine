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
    $role = $user['role'];
    $userId = $user['userId'];
    $status = $_GET['status'] ?? null;

    $query = "SELECT * FROM appointments";
    $params = [];
    $conditions = [];

    if ($role === 'patient') {
        $conditions[] = "patient_id = ?";
        $params[] = $userId;
    }

    if ($status) {
        $conditions[] = "status = ?";
        $params[] = $status;
    }

    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }

    $query .= " ORDER BY appointment_date DESC, appointment_time DESC";

    $appointments = Database::fetchAll($query, $params);
    echo json_encode($appointments);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
