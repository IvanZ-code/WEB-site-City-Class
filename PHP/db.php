<?php
$host = "localhost";
$port = "5432";
$dbname = "WebDB";
$user = "postgres";      
$pass = "135246asdfZXCV";          

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения к БД: " . $e->getMessage());
}
?>