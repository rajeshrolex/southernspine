<?php
require_once __DIR__ . '/config.php';

function handleCORS() {
    $allowed_origins = explode(',', config('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000'));
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (empty($origin)) {
        header("Access-Control-Allow-Origin: *");
    } else if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: " . ($allowed_origins[0] ?? '*'));
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
