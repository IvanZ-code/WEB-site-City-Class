<?php
require 'db.php';
header('Content-Type: application/json');

$sliderNumber = $_GET['slider'] ?? 1;

// Берём все слайды для слайдера, сортируя по slide_number
$stmt = $pdo->prepare("SELECT slide_number, image_data FROM slides WHERE slider_number = :slider_number ORDER BY slide_number ASC");
$stmt->execute(['slider_number' => $sliderNumber]);
$slides = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Формируем массив с base64 картинками
$result = [];
foreach ($slides as $slide) {
    
    if (is_resource($slide['image_data'])) {
        $data = stream_get_contents($slide['image_data']); 
    } else {
        $data = $slide['image_data'];
    }

    $imgBase64 = 'data:image/jpeg;base64,' . base64_encode($data);

    $result[] = [
        'slide_number' => $slide['slide_number'],
        'image_data' => $imgBase64
    ];
}

echo json_encode($result);
