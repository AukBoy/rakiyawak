<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK SYSTEM LOG INSPECTOR ===\n";

$logs_dir = '/home/rakiyawa/logs';
$etc_dir = '/home/rakiyawa/etc';

echo "\n--- 1. Listing files in /home/rakiyawa/logs ---\n";
if (is_dir($logs_dir)) {
    $files = scandir($logs_dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $full_path = $logs_dir . '/' . $file;
        $size = is_file($full_path) ? " (" . filesize($full_path) . " bytes)" : " (DIR)";
        echo "$file$size\n";
    }
} else {
    echo "Logs directory not found at $logs_dir\n";
}

echo "\n--- 2. Listing files in /home/rakiyawa/etc ---\n";
if (is_dir($etc_dir)) {
    $files = scandir($etc_dir);
    print_r($files);
} else {
    echo "etc directory not found at $etc_dir\n";
}

echo "\n--- 3. Reading Domain Error Logs ---\n";
if (is_dir($logs_dir)) {
    $files = scandir($logs_dir);
    foreach ($files as $file) {
        // Look for error logs or domain logs
        if (strpos($file, 'error') !== false || strpos($file, 'rakiyawak') !== false || strpos($file, 'log') !== false) {
            $full_path = $logs_dir . '/' . $file;
            if (is_file($full_path) && filesize($full_path) > 0) {
                echo "\n=== Log File: $file (" . filesize($full_path) . " bytes) ===\n";
                $lines = file($full_path);
                $last_lines = array_slice($lines, -50); // get last 50 lines
                echo implode("", $last_lines) . "\n";
                echo "====================================\n";
            }
        }
    }
}

?>
