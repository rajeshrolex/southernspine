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

    if ($role === 'patient') {
        $reports = Database::fetchAll(
            "SELECT * FROM reports WHERE patient_id = ? ORDER BY report_date DESC",
            [$userId]
        );
    } else {
        // Doctors/Admins might need a different query (e.g., all reports or reports for a specific patient)
        $patientId = $_GET['patient_id'] ?? null;
        if ($patientId) {
            $reports = Database::fetchAll(
                "SELECT * FROM reports WHERE patient_id = ? ORDER BY report_date DESC",
                [$patientId]
            );
        } else {
            $reports = Database::fetchAll("SELECT * FROM reports ORDER BY report_date DESC");
        }
    }

    echo json_encode($reports);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
