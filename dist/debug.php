<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK SYMLINK CREATOR ===\n";

$target = '/home/rakiyawa/repositories/rakiyawak';
$link = '/home/rakiyawa/public_html/api';

if (!file_exists($link)) {
    echo "Creating symlink from $target to $link...\n";
    if (symlink($target, $link)) {
        echo "SUCCESS: Symlink created successfully!\n";
    } else {
        echo "WARNING: Failed to create symlink. Trying to create a directory...\n";
        if (mkdir($link, 0755)) {
            echo "SUCCESS: Directory created successfully!\n";
        } else {
            echo "ERROR: Failed to create directory.\n";
        }
    }
} else {
    echo "INFO: api link/directory already exists.\n";
    if (is_link($link)) {
        echo "Type: Symlink pointing to: " . readlink($link) . "\n";
    } else {
        echo "Type: Regular directory.\n";
    }
}

echo "\n--- current public_html contents ---\n";
$public_html_path = '/home/rakiyawa/public_html';
if (is_dir($public_html_path)) {
    $files = scandir($public_html_path);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $full_path = $public_html_path . '/' . $file;
        $type = is_dir($full_path) ? (is_link($full_path) ? 'LINK' : 'DIR') : 'FILE';
        echo "[$type] $file\n";
    }
}

?>
