<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'not_authenticated']);
    exit;
}

$username = $_SESSION['username'];

$data = json_decode(file_get_contents("php://input"), true);
$productId = $data['product_id'] ?? null;
$quantity = $data['quantity'] ?? null;

if (!$productId || !is_numeric($quantity) || $quantity < 1) {
    echo json_encode(['error' => 'invalid_input']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE user_cart
        SET quantity = :quantity
        WHERE username = :username AND product_id = :product_id
    ");
    $stmt->execute([
        'username' => $username,
        'product_id' => $productId,
        'quantity' => $quantity
    ]);

    echo json_encode(['status' => 'updated']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'db_error: ' . $e->getMessage()]);
}
