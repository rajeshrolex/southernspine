<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/AuthHelper.php';

handleCORS();

$user = AuthHelper::getAuthenticatedUser();
if (!$user || !in_array($user['role'], ['doctor', 'admin', 'hr', 'patient'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

try {
    $patient_id = ($user['role'] === 'patient') ? $user['userId'] : ($_POST['patient_id'] ?? null);
    $title = $_POST['title'] ?? '';
    
    if (empty($title) && isset($_FILES['file'])) {
        $title = $_FILES['file']['name'];
    }

    $category = $_POST['category'] ?? 'Progress';
    $notes = $_POST['notes'] ?? '';
    
    if (!$patient_id || empty($title)) {
        http_response_code(400);
        echo json_encode(['error' => 'Patient and title are required']);
        exit();
    }

    $file_path = '';
    
    // Handle File Upload
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/../../uploads/reports/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid('report_') . '.' . $file_extension;
        $target_file = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
            $file_path = 'uploads/reports/' . $file_name;
        } else {
            throw new Exception("Failed to move uploaded file");
        }
    }

    $query = "INSERT INTO reports (patient_id, title, category, report_date, uploaded_by, file_path) VALUES (?, ?, ?, CURDATE(), ?, ?)";
    Database::query($query, [$patient_id, $title, $category, $user['name'], $file_path]);

    echo json_encode([
        'success' => true,
        'message' => 'Report uploaded successfully',
        'report_id' => Database::getInstance()->lastInsertId()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
