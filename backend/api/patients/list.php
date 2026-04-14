<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

$user = AuthHelper::getAuthenticatedUser();
if (!$user || ($user['role'] !== 'doctor' && $user['role'] !== 'admin')) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

try {
    $search = $_GET['search'] ?? '';
    
    $query = "SELECT id, name, email, phone, created_at FROM users WHERE role = 'patient'";
    $params = [];

    if ($search) {
        $query .= " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
        $searchTerm = "%$search%";
        $params = [$searchTerm, $searchTerm, $searchTerm];
    }

    $query .= " ORDER BY name ASC";

    $patients = Database::fetchAll($query, $params);
    echo json_encode($patients);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
