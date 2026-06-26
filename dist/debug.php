<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK POST-RESTART DIAGNOSTICS ===\n";

$public_html_path = '/home/rakiyawa/public_html';
$app_path = '/home/rakiyawa/repositories/rakiyawak';

echo "\n--- 1. Running Processes Check ---\n";
if (function_exists('shell_exec')) {
    echo shell_exec('ps aux | grep -i node');
} else {
    echo "shell_exec is disabled\n";
}

echo "\n--- 2. Requesting /api/auth/login locally ---\n";
$url = 'http://rakiyawak.com/api/auth/login';

$options = array(
    'http' => array(
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n",
        'content' => json_encode(array('email' => 'test@test.com', 'password' => '123', 'role' => 'seeker')),
        'ignore_errors' => true // Capture 404/500/etc.
    )
);
$context  = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo "Response Headers:\n";
if (isset($http_response_header)) {
    print_r($http_response_header);
} else {
    echo "No response headers captured.\n";
}

echo "\nResponse Body (first 500 chars):\n";
if ($response !== false) {
    echo substr($response, 0, 500) . "\n";
    if (strlen($response) > 500) {
        echo "... [TRUNCATED] ...\n";
    }
} else {
    echo "Error making request to $url\n";
}

?>
