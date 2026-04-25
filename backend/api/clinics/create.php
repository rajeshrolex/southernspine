<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$user = AuthHelper::getAuthenticatedUser();
if (!$user || $user['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$address = $data['address'] ?? '';
$phone = $data['phone'] ?? '';

if (empty($name) || empty($address)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and address are required']);
    exit();
}

try {
    Database::query(
        "INSERT INTO clinics (name, address, phone, status) VALUES (?, ?, ?, 'active')",
        [$name, $address, $phone]
    );

    echo json_encode(['success' => true, 'message' => 'Clinic created successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
