<?php
// backend/api/admin/doctors_manage.php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();
header('Content-Type: application/json');

// 1. Authenticate Admin
$payload = AuthHelper::getAuthenticatedUser();

if (!$payload || $payload['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized. Admin access required.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        // ADD DOCTOR
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? 'test1234';
        $phone = $data['phone'] ?? '';
        $specialty = $data['specialty'] ?? '';
        $experience = $data['experience'] ?? '';

        if (empty($name) || empty($email)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and Email are required']);
            exit();
        }

        // Check if email exists
        $existing = Database::fetchOne("SELECT id FROM users WHERE email = ?", [$email]);
        if ($existing) {
            http_response_code(409);
            echo json_encode(['error' => 'A user with this email already exists']);
            exit();
        }

        $hashedPass = password_hash($password, PASSWORD_BCRYPT);
        
        Database::query(
            "INSERT INTO users (name, email, password, role, phone, specialty, experience) VALUES (?, ?, ?, 'doctor', ?, ?, ?)",
            [$name, $email, $hashedPass, $phone, $specialty, $experience]
        );

        echo json_encode(['message' => 'Doctor added successfully', 'id' => Database::lastInsertId()]);
    } 
    elseif ($method === 'PATCH') {
        // UPDATE DOCTOR
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Doctor ID is required']);
            exit();
        }

        $fields = [];
        $params = [];

        if (isset($data['name'])) { $fields[] = "name = ?"; $params[] = $data['name']; }
        if (isset($data['email'])) { $fields[] = "email = ?"; $params[] = $data['email']; }
        if (isset($data['phone'])) { $fields[] = "phone = ?"; $params[] = $data['phone']; }
        if (isset($data['specialty'])) { $fields[] = "specialty = ?"; $params[] = $data['specialty']; }
        if (isset($data['experience'])) { $fields[] = "experience = ?"; $params[] = $data['experience']; }
        
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            exit();
        }

        $params[] = $id;
        $query = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ? AND role = 'doctor'";
        Database::query($query, $params);

        echo json_encode(['message' => 'Doctor updated successfully']);
    }
    elseif ($method === 'DELETE') {
        // DELETE DOCTOR
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Doctor ID is required']);
            exit();
        }

        Database::query("DELETE FROM users WHERE id = ? AND role = 'doctor'", [$id]);
        echo json_encode(['message' => 'Doctor removed successfully']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
