<?php
require 'db.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_GET['ids'])) {
    echo json_encode(['error' => 'Не переданы id товаров']);
    exit;
}

$ids = explode(',', $_GET['ids']);
$placeholders = implode(',', array_fill(0, count($ids), '?'));

try {
    $stmt = $pdo->prepare("
        SELECT id, title, price, image_path
        FROM products
        WHERE id IN ($placeholders)
        ORDER BY id ASC
    ");
    $stmt->execute($ids);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка запроса: ' . $e->getMessage()]);
}
?>
