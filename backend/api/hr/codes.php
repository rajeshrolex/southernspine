<?php
// backend/api/hr/codes.php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();
header('Content-Type: application/json');

// 1. Authenticate Role (Admin or HR)
$payload = AuthHelper::getAuthenticatedUser();

if (!$payload || ($payload['role'] !== 'hr' && $payload['role'] !== 'admin')) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied. HR or Admin authorization required.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // List all codes
        $codes = Database::fetchAll("SELECT * FROM staff_codes ORDER BY created_at DESC");
        echo json_encode($codes);
    } 
    elseif ($method === 'POST') {
        // Generate new code
        $data = json_decode(file_get_contents('php://input'), true);
        $code = $data['code'] ?? '';
        $limit = $data['usage_limit'] ?? 1;

        if (empty($code)) {
            http_response_code(400);
            echo json_encode(['error' => 'Code is required']);
            exit();
        }

        Database::query(
            "INSERT INTO staff_codes (code, usage_limit) VALUES (?, ?)",
            [$code, $limit]
        );

        echo json_encode(['message' => 'Authorization code created successfully']);
    } 
    elseif ($method === 'PATCH') {
        // Toggle active status
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        $status = $data['is_active'] ?? null;

        if ($id === null || $status === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID or status']);
            exit();
        }

        Database::query(
            "UPDATE staff_codes SET is_active = ? WHERE id = ?",
            [$status ? 1 : 0, $id]
        );

        echo json_encode(['message' => 'Status updated successfully']);
    }
    elseif ($method === 'DELETE') {
        // Delete code
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
            exit();
        }

        Database::query("DELETE FROM staff_codes WHERE id = ?", [$id]);
        echo json_encode(['message' => 'Code deleted successfully']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
