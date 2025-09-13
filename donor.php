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
$first = $input['firstName'] ?? null;
$last  = $input['lastName'] ?? null;
$email = $input['email'] ?? null;
$phone = $input['phone'] ?? null;
$age   = intval($input['age'] ?? 0);
$weight = intval($input['weight'] ?? 0);
$blood = $input['bloodType'] ?? null;
$camp  = $input['preferredCamp'] ?? null;
$history = $input['medicalHistory'] ?? null;

if (!$first || !$last || !$email || !$phone || !$age || !$weight || !$blood) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare('INSERT INTO donors (first_name, last_name, email, phone, age, weight_kg, blood_type, preferred_camp, medical_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->bind_param('ssssissss', $first, $last, $email, $phone, $age, $weight, $blood, $camp, $history);
if ($stmt->execute()) {
    echo json_encode(['id' => $stmt->insert_id, 'message' => 'Donor registered successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Insert failed']);
}
$stmt->close();
$conn->close(); 