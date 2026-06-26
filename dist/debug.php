<?php
// Version: 1.0.1
header('Content-Type: text/plain');

echo "=== RAKIYAWAK DEPLOYMENT DIAGNOSTICS ===\n";

$public_html_path = '/home/rakiyawa/public_html';
$app_path = '/home/rakiyawa/repositories/rakiyawak';

echo "\n--- .htaccess contents ---\n";
$htaccess_file = $public_html_path . '/.htaccess';
if (file_exists($htaccess_file)) {
    echo file_get_contents($htaccess_file);
} else {
    echo ".htaccess not found at $htaccess_file\n";
}

echo "\n--- public_html directory listing ---\n";
if (is_dir($public_html_path)) {
    $files = scandir($public_html_path);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $full_path = $public_html_path . '/' . $file;
        $type = is_dir($full_path) ? 'DIR' : 'FILE';
        $size = is_dir($full_path) ? '' : ' (' . filesize($full_path) . ' bytes)';
        echo "[$type] $file$size\n";
    }
} else {
    echo "public_html directory not found\n";
}

echo "\n--- App directory listing ---\n";
if (is_dir($app_path)) {
    $files = scandir($app_path);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $full_path = $app_path . '/' . $file;
        $type = is_dir($full_path) ? 'DIR' : 'FILE';
        $size = is_dir($full_path) ? '' : ' (' . filesize($full_path) . ' bytes)';
        echo "[$type] $file$size\n";
    }
} else {
    echo "App directory not found\n";
}

echo "\n--- Node virtualenv check ---\n";
$nodevenv_path = '/home/rakiyawa/nodevenv';
if (is_dir($nodevenv_path)) {
    echo "nodevenv directory exists. Subdirectories:\n";
    $venv_files = scandir($nodevenv_path);
    print_r($venv_files);
} else {
    echo "nodevenv directory not found\n";
}

echo "\n--- Passenger / Node logs check ---\n";
// Look for logs inside the application root or parent
$possible_log_dirs = [
    $app_path,
    dirname($app_path),
    '/home/rakiyawa'
];

foreach ($possible_log_dirs as $dir) {
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $file) {
            if (strpos($file, 'log') !== false || strpos($file, 'err') !== false) {
                $full_path = $dir . '/' . $file;
                if (is_file($full_path)) {
                    echo "Found Log: $full_path (" . filesize($full_path) . " bytes)\n";
                    $content = file_get_contents($full_path);
                    // print last 1000 characters
                    echo "--- Last 1000 chars ---\n";
                    echo substr($content, -1000) . "\n";
                    echo "-----------------------\n";
                }
            }
        }
    }
}

// Check system passenger log if accessible
$passenger_log = '/home/rakiyawa/.passenger/log/passenger.log';
if (file_exists($passenger_log)) {
    echo "Found Passenger log: $passenger_log (" . filesize($passenger_log) . " bytes)\n";
    $content = file_get_contents($passenger_log);
    echo "--- Last 1000 chars ---\n";
    echo substr($content, -1000) . "\n";
}

echo "\n--- Environment variables ---\n";
echo "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "SERVER_SOFTWARE: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "HTTP_HOST: " . $_SERVER['HTTP_HOST'] . "\n";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";

?>
