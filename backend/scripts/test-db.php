<?php
require_once __DIR__ . '/../config/database.php';

try {
    $conn = Database::getInstance();
    echo "Successfully connected to the database!\n";
    
    $result = Database::fetchOne("SELECT VERSION() as version");
    echo "MySQL Version: " . $result['version'] . "\n";
    
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
