<?php
require 'db.php';
header('Content-Type: application/json; charset=utf-8');


try {
    $stmt = $pdo->prepare("
        SELECT id, title, price, href, image_path, short_description, full_description, product_type, web_id
        FROM products
        WHERE product_type = :product_type
        ORDER BY web_id ASC
    ");
    $stmt->execute(['product_type' => 'male boot']);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка запроса: ' . $e->getMessage()]);
}
?>
