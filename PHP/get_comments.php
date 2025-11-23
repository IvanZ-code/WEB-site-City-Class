<?php
header('Content-Type: application/json');
require_once 'db.php';

$page = $_GET['page'] ?? '';

// Получаем все комментарии для страницы
$stmt = $pdo->prepare("SELECT comment_data FROM comments WHERE page = :page ORDER BY comment_data->>'date' DESC");
$stmt->execute(['page' => $page]);

$comments = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Преобразуем JSONB в массив объектов для JS
$commentsArray = array_map(fn($c) => json_decode($c, true), $comments);

echo json_encode($commentsArray);
?>
