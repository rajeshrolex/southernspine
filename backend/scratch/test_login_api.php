<?php
$url = 'http://localhost:8000/auth/login.php';
$data = ['email' => 'admin@demo.com', 'password' => 'test'];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$status_line = $http_response_header[0];

echo "Status: $status_line\n";
echo "Body: |$result|\n";
?>
