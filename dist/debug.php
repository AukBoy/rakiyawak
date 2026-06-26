<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK API DIR INSPECTOR ===\n";

$api_dir = '/home/rakiyawa/public_html/api';

if (is_dir($api_dir)) {
    echo "Files in public_html/api:\n";
    $files = scandir($api_dir);
    print_r($files);
    
    $htaccess = $api_dir . '/.htaccess';
    if (file_exists($htaccess)) {
        echo "\nContents of public_html/api/.htaccess:\n";
        echo file_get_contents($htaccess);
    } else {
        echo "\nNo .htaccess found inside public_html/api/\n";
    }
} else {
    echo "public_html/api is not a directory.\n";
}

?>
