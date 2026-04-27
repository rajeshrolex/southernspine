<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createUnsafeMutable(__DIR__ . '/../');
$dotenv->load();

// Generic configuration access
function config($key, $default = null) {
    if (isset($_ENV[$key])) return $_ENV[$key];
    if (isset($_SERVER[$key])) return $_SERVER[$key];
    $val = getenv($key);
    if ($val !== false) return $val;
    return $default;
}
