<?php
header('Content-Type: application/json; charset=UTF-8');

$page = $_GET['page'] ?? 'default';
$filename = "../Comments/{$page}.json"; 
$comments = [];

if (file_exists($filename)) {
    $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $entry = json_decode($line, true);
        if ($entry && isset($entry['username'], $entry['comment'], $entry['date'])) {
            $comments[] = [
                'username' => $entry['username'],
                'comment'  => $entry['comment'],
                'date'     => $entry['date']
            ];
        }
    }
}

$comments = array_reverse($comments);


echo json_encode($comments, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
