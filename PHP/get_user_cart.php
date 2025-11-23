<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'not_authenticated']);
    exit;
}

$username = $_SESSION['username'];

try {
    $stmt = $pdo->prepare("
        SELECT product_id, quantity
        FROM user_cart
        WHERE username = :username
        ORDER BY product_id ASC
    ");
    $stmt->execute(['username' => $username]);

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['cart' => $items], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(['error' => 'db_error: ' . $e->getMessage()]);
}
