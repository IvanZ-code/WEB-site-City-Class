<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;

        echo json_encode(['success' => true, 'username' => $username]);
        exit;
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверное имя пользователя или пароль.']);
        exit;
    }
}


echo json_encode(['success' => false, 'message' => 'Некорректный запрос.']);
