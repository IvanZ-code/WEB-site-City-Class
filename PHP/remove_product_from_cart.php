<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'not_authenticated']);
    exit;
}

$username = $_SESSION['username'];
$productId = $_POST['product_id'] ?? null;

if (!$productId) {
    echo json_encode(['error' => 'no_product_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        DELETE FROM user_cart
        WHERE username = :username AND product_id = :product_id
    ");
    $stmt->execute([
        'username' => $username,
        'product_id' => $productId
    ]);

    echo json_encode(['status' => 'removed']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'db_error: ' . $e->getMessage()]);
}
