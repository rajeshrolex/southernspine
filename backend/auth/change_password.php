<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../helpers/AuthHelper.php';

handleCORS();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$user = AuthHelper::getAuthenticatedUser();
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$old_password = $data['old_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($old_password) || empty($new_password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Old password and new password are required']);
    exit();
}

if (strlen($new_password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'New password must be at least 6 characters']);
    exit();
}

try {
    // Fetch current user from DB to get the hashed password
    $dbUser = Database::fetchOne("SELECT * FROM users WHERE id = ?", [$user['userId']]);
    
    if (!$dbUser) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit();
    }

    if (!password_verify($old_password, $dbUser['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Incorrect old password']);
        exit();
    }

    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    Database::query("UPDATE users SET password = ? WHERE id = ?", [$hashed_password, $user['userId']]);

    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
