<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../helpers/AuthHelper.php';

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'patient'; // Default to patient

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit();
}

try {
    // Check if user exists
    $existing = Database::fetchOne("SELECT id FROM users WHERE email = ?", [$email]);
    if ($existing) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    Database::query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [$name, $email, $hashedPassword, $role]
    );

    $user_id = Database::getInstance()->lastInsertId();

    // Generate token
    $token = AuthHelper::generateToken($user_id, $role);

    http_response_code(201);
    echo json_encode([
        'message' => 'User registered successfully',
        'token' => $token,
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'role' => $role
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
