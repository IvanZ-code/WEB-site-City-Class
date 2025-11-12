<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Не передан ID товара']);
    exit;
}

$id = (int)$_GET['id'];

try {
    $stmt = $pdo->prepare("
        SELECT id, title, price, image_path, short_description, full_description
        FROM products
        WHERE id = :id
        LIMIT 1
    ");
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        echo json_encode(['error' => 'Товар не найден']);
        exit;
    }

    echo json_encode($product, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка БД: ' . $e->getMessage()]);
}
?>
