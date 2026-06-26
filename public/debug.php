<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK SYSTEM LOG INSPECTOR ===\n";

$logs_dir = '/home/rakiyawa/logs';
$etc_dir = '/home/rakiyawa/etc';

echo "\n--- 1. Listing etc/rakiyawak.com ---\n";
$etc_domain = $etc_dir . '/rakiyawak.com';
if (is_dir($etc_domain)) {
    $files = scandir($etc_domain);
    print_r($files);
} else {
    echo "etc/rakiyawak.com not found\n";
}

echo "\n--- 2. Reading Gzipped Domain Logs ---\n";

function printGzLog($filepath) {
    if (file_exists($filepath)) {
        echo "\n=== Log File: " . basename($filepath) . " (" . filesize($filepath) . " bytes) ===\n";
        $zp = gzopen($filepath, "r");
        if ($zp) {
            $content = '';
            while (!gzeof($zp)) {
                $content .= gzread($zp, 4096);
            }
            gzclose($zp);
            
            $lines = explode("\n", $content);
            $last_lines = array_slice($lines, -50); // Get last 50 lines
            echo implode("\n", $last_lines) . "\n";
        } else {
            echo "Failed to open gzipped log file.\n";
        }
        echo "====================================\n";
    }
}

if (is_dir($logs_dir)) {
    $files = scandir($logs_dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        if (strpos($file, 'rakiyawak.com') !== false && strpos($file, '.gz') !== false) {
            printGzLog($logs_dir . '/' . $file);
        }
    }
}

?>
