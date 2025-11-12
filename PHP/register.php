<?php
require 'db.php';
header('Content-Type: application/json');

$response = ["status" => "error", "message" => ""];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $fullname = trim($_POST['fullname'] ?? '');

    // Проверка на заполненность
    if (empty($username) || empty($password) || empty($confirm_password) ||
        empty($email) || empty($phone) || empty($fullname)) {
        $response['message'] = "Заполните все поля.";
        echo json_encode($response);
        exit;
    }
    if (strlen($username) > 20) {
        $response['message'] = "Логин не должен превышать 255 символов.";
        echo json_encode($response);
        exit;
    }

    if (strlen($password) > 255) {
        $response['message'] = "Пароль слишком длинный.";
        echo json_encode($response);
        exit;
    }

    if (strlen($email) > 100) {
        $response['message'] = "E-mail не должен превышать 100 символов.";
        echo json_encode($response);
        exit;
    }

    if (strlen($phone) > 20) {
        $response['message'] = "Телефон слишком длинный.";
        echo json_encode($response);
        exit;
    }

    if (strlen($fullname) > 100) {
        $response['message'] = "ФИО не должно превышать 100 символов.";
        echo json_encode($response);
        exit;
    }

    // Проверка совпадения паролей
    if ($password !== $confirm_password) {
        $response['message'] = "Пароли не совпадают.";
        echo json_encode($response);
        exit;
    }

    // Проверка формата e-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "Некорректный формат e-mail.";
        echo json_encode($response);
        exit;
    }

    // Проверка формата телефона (+7 ...)
    if (!preg_match('/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/', $phone)) {
        $response['message'] = "Некорректный формат телефона.\nПример: +7 (999) 123-45-67";
        echo json_encode($response);
        exit;
    }

    // Проверка существующего пользователя
    $check = $pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email OR phone = :phone");
    $check->execute([':username' => $username, ':email' => $email, ':phone' => $phone]);

    if ($check->rowCount() > 0) {
        $response['message'] = "Пользователь с таким логином, телефоном или e-mail уже существует.";
        echo json_encode($response);
        exit;
    }

    // Хеширование пароля
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    // Запись нового пользователя
    $stmt = $pdo->prepare("INSERT INTO users (username, password, email, phone, fullname) 
                           VALUES (:username, :password, :email, :phone, :fullname)");
    $stmt->execute([
        ':username' => $username,
        ':password' => $hashed,
        ':email' => $email,
        ':phone' => $phone,
        ':fullname' => $fullname
    ]);

    $response['status'] = "success";
    $response['message'] = "Регистрация успешна!";
}

echo json_encode($response);
