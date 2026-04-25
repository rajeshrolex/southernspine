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
    $appointmentId = $data['id'] ?? null;

    if (!$appointmentId) {
        http_response_code(400);
        echo json_encode(['error' => 'Appointment ID is required']);
        exit();
    }

    // Verify the appointment belongs to this patient and is still upcoming
    $appointment = Database::fetchOne(
        "SELECT * FROM appointments WHERE id = ? AND patient_id = ? AND status = 'upcoming'",
        [$appointmentId, $user['userId']]
    );

    if (!$appointment) {
        http_response_code(404);
        echo json_encode(['error' => 'Appointment not found or cannot be cancelled']);
        exit();
    }

    Database::query(
        "UPDATE appointments SET status = 'cancelled' WHERE id = ?",
        [$appointmentId]
    );

    echo json_encode(['message' => 'Appointment cancelled successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
