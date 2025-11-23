<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Вы не авторизованы']);
    exit;
}

$page = $_POST['page'] ?? '';
$text = trim($_POST['comment'] ?? '');
$username = $_SESSION['username'];

if ($text === '') {
    echo json_encode(['success' => false, 'message' => 'Комментарий пустой']);
    exit;
}

date_default_timezone_set('Europe/Moscow');
// Формируем JSON для комментария
$commentData = [
    'username' => $username,
    'comment' => $text,
    'date' => date('Y-m-d H:i:s')
];
$commentJson = json_encode($commentData);

// Вставляем комментарий в таблицу
$stmt = $pdo->prepare("INSERT INTO comments (page, comment_data) VALUES (:page, :comment_data) RETURNING comment_data");
$stmt->execute([
    'page' => $page,
    'comment_data' => $commentJson
]);

$entry = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'entry' => json_decode($entry['comment_data'], true)]);
?>
