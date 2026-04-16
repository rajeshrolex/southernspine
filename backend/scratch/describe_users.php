<?php
require_once __DIR__ . '/../config/database.php';
$res = Database::fetchAll('DESCRIBE users');
print_r($res);
