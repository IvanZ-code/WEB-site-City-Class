<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Профиль</title>
</head>
<body>
  <h2>Привет, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
  <p>Ты успешно вошёл в систему</p>
  <a href="logout.php">Выйти</a>
</body>
</html>