<?php
header('Content-Type: text/plain');
echo "=== HTACCESS CHECK ===\n";
echo "Server Time: " . date('Y-m-d H:i:s') . "\n\n";
$file = '/home/rakiyawa/public_html/.htaccess';
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo "No .htaccess found at $file\n";
}
?>
