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

if (!$productId) {
    echo json_encode(['error' => 'no_product_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id FROM user_cart
        WHERE username = :username AND product_id = :product_id
        LIMIT 1
    ");
    $stmt->execute([
        'username' => $username,
        'product_id' => $productId
    ]);

    if ($stmt->fetch()) {
        echo json_encode(['status' => 'already_exists']);
        exit;
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO user_cart (username, product_id, quantity)
        VALUES (:username, :product_id, 1)
    ");
    $stmt->execute([
        'username' => $username,
        'product_id' => $productId
    ]);

    echo json_encode(['status' => 'added']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'db_error: ' . $e->getMessage()]);
}
