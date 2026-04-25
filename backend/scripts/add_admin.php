<?php
require_once __DIR__ . '/../config/database.php';

$name = 'Bhargav Admin';
$email = 'bhargav@admin.com';
$password = 'admin123';
$role = 'admin';

try {
    // Check if user exists
    $existing = Database::fetchOne("SELECT id FROM users WHERE email = ?", [$email]);
    if ($existing) {
        echo "Error: User with email $email already exists.\n";
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    Database::query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [$name, $email, $hashedPassword, $role]
    );

    echo "Successfully created new admin!\n";
    echo "Email: $email\n";
    echo "Password: $password\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
