<?php
// backend/scratch/add_doctor_columns.php
require_once __DIR__ . '/../config/database.php';

try {
    echo "Adding specialty and experience columns...\n";
    // Check if columns exist first to avoid double-add errors (MySQL 5.7+ doesn't support ADD COLUMN IF NOT EXISTS natively in some versions)
    $cols = Database::fetchAll("SHOW COLUMNS FROM users");
    $fields = array_column($cols, 'Field');
    
    if (!in_array('specialty', $fields)) {
        Database::query("ALTER TABLE users ADD COLUMN specialty VARCHAR(100)");
        echo "Added specialty column.\n";
    }
    
    if (!in_array('experience', $fields)) {
        Database::query("ALTER TABLE users ADD COLUMN experience VARCHAR(50)");
        echo "Added experience column.\n";
    }
    
    echo "Database schema updated successfully.\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
