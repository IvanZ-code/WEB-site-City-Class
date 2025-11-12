<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit;
}

if (!isset($_POST['comment']) || trim($_POST['comment']) === '') {
    echo json_encode(['success' => false, 'message' => 'Пустой комментарий']);
    exit;
}

date_default_timezone_set('Europe/Moscow');

$comment = trim($_POST['comment']);
$username = $_SESSION['username'];
$date = date('Y-m-d H:i:s');

$entry = [
    'username' => $username,
    'comment' => $comment,
    'date' => $date
];

$jsonLine = json_encode($entry, JSON_UNESCAPED_UNICODE) . "\n";

$page = $_POST['page'] ?? 'default';
file_put_contents("../Comments/{$page}.json", $jsonLine, FILE_APPEND | LOCK_EX);

echo json_encode(['success' => true, 'entry' => $entry]);
?>
