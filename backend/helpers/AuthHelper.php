<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthHelper {
    private static $secret_key;
    private static $algorithm = 'HS256';

    public static function init() {
        self::$secret_key = config('JWT_SECRET', 'default_secret_key_123');
    }

    public static function generateToken($user_id, $role) {
        self::init();
        $issuedAt = time();
        $expirationTime = $issuedAt + config('JWT_EXPIRY', 3600);
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'userId' => $user_id,
            'role' => $role
        ];

        return JWT::encode($payload, self::$secret_key, self::$algorithm);
    }

    public static function verifyToken($token) {
        self::init();
        try {
            $decoded = JWT::decode($token, new Key(self::$secret_key, self::$algorithm));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function getAuthenticatedUser() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            return self::verifyToken($token);
        }

        return false;
    }
}
