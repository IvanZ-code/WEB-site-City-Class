<?php
require 'db.php';

// Номер слайдера для этих картинок
$sliderNumber = 1;

// Массив с номерами слайдов и путями к файлам на сервере
$slides = [
    1 => '../Pictures/slides/slider 1/slide1.jpeg',
    2 => '../Pictures/slides/slider 1/slide2.jpeg',
    3 => '../Pictures/slides/slider 1/slide3.jpeg'
];

foreach ($slides as $slideNumber => $path) {
    if (!file_exists($path)) {
        echo "Файл $path не найден\n";
        continue;
    }

    // Читаем картинку в бинарный формат
    $imageData = file_get_contents($path);

    // Вставляем запись в таблицу slides
    $stmt = $pdo->prepare("
        INSERT INTO slides (slider_number, slide_number, image_data)
        VALUES (:slider_number, :slide_number, :image_data)
    ");
    $stmt->bindParam(':slider_number', $sliderNumber);
    $stmt->bindParam(':slide_number', $slideNumber);
    $stmt->bindParam(':image_data', $imageData, PDO::PARAM_LOB);
    $stmt->execute();

    echo "Слайд $slideNumber добавлен в слайдер $sliderNumber\n";
}
?>
