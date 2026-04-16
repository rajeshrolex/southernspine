<?php
// backend/scripts/update-credentials.php
require_once __DIR__ . '/../config/database.php';

try {
    echo "Updating credentials to new standards...\n";
    
    // New data
    $newPassword = 'test';
    $hashedPass = password_hash($newPassword, PASSWORD_BCRYPT);
    
    $updates = [
        ['role' => 'patient', 'name' => 'Patient', 'email' => 'patient@demo.com'],
        ['role' => 'doctor', 'name' => 'Doctor', 'email' => 'doctor@demo.com'],
        ['role' => 'admin', 'name' => 'Admin', 'email' => 'admin@demo.com'],
    ];

    foreach ($updates as $u) {
        Database::query(
            "UPDATE users SET name = ?, password = ? WHERE role = ? AND email = ?",
            [$u['name'], $hashedPass, $u['role'], $u['email']]
        );
        echo "Updated {$u['role']} to '{$u['name']}' with password '$newPassword'.\n";
    }

    echo "CREDENTIALS UPDATED SUCCESSFULLY!\n";

} catch (Exception $e) {
    echo "Update failed: " . $e->getMessage() . "\n";
}
