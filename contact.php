<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$db   = getenv('DB_NAME') ?: 'bloodcamp';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$subject = $input['subject'] ?? null;
$message = $input['message'] ?? null;

if (!$name || !$email || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $name, $email, $subject, $message);
if ($stmt->execute()) {
    echo json_encode(['id' => $stmt->insert_id, 'message' => 'Message received']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Insert failed']);
}
$stmt->close();
$conn->close(); 