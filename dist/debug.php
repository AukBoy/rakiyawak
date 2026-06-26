<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK DEPLOYMENT DIAGNOSTICS ===\n";

$public_html_path = '/home/rakiyawa/public_html';
$app_path = '/home/rakiyawa/repositories/rakiyawak';
$node_bin = '/home/rakiyawa/nodevenv/repositories/rakiyawak/20/bin/node';
$server_js = $app_path . '/server.js';

echo "\n--- .htaccess check ---\n";
$htaccess_file = $public_html_path . '/.htaccess';
if (file_exists($htaccess_file)) {
    echo "Found .htaccess. Length: " . filesize($htaccess_file) . " bytes.\n";
} else {
    echo ".htaccess not found at $htaccess_file\n";
}

echo "\n--- Listing tmp/ directory ---\n";
$tmp_dir = $app_path . '/tmp';
if (is_dir($tmp_dir)) {
    print_r(scandir($tmp_dir));
} else {
    echo "tmp directory not found\n";
}

echo "\n--- Process check (ps aux) ---\n";
if (function_exists('shell_exec')) {
    $ps_output = shell_exec('ps aux | grep -i node');
    echo $ps_output ? $ps_output : "No node processes found in ps output.\n";
} else {
    echo "shell_exec is disabled\n";
}

echo "\n--- Manual Node.js Startup Test ---\n";
if (!file_exists($node_bin)) {
    echo "ERROR: Node binary not found at $node_bin\n";
}
if (!file_exists($server_js)) {
    echo "ERROR: server.js not found at $server_js\n";
}

if (file_exists($node_bin) && file_exists($server_js)) {
    echo "Running command: $node_bin $server_js\n";
    
    $descriptorspec = array(
       0 => array("pipe", "r"),  // stdin
       1 => array("pipe", "w"),  // stdout
       2 => array("pipe", "w")   // stderr
    );

    $process = proc_open("$node_bin $server_js", $descriptorspec, $pipes);

    if (is_resource($process)) {
        fclose($pipes[0]);

        // Set non-blocking
        stream_set_blocking($pipes[1], 0);
        stream_set_blocking($pipes[2], 0);

        // Wait 2 seconds for server to start or crash
        usleep(2000000); 

        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);

        fclose($pipes[1]);
        fclose($pipes[2]);

        proc_terminate($process);
        proc_close($process);

        echo "--- STDOUT ---\n";
        echo $stdout ? $stdout : "(no output)\n";
        echo "\n--- STDERR ---\n";
        echo $stderr ? $stderr : "(no output)\n";
    } else {
        echo "ERROR: Could not execute proc_open\n";
    }
}

echo "\n--- Environment variables ---\n";
echo "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "SERVER_SOFTWARE: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "HTTP_HOST: " . $_SERVER['HTTP_HOST'] . "\n";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";

?>
