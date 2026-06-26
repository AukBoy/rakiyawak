<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK HTTP 500 DIAGNOSTICS ===\n";

$app_path = '/home/rakiyawa/repositories/rakiyawak';
$node_bin = '/home/rakiyawa/nodevenv/repositories/rakiyawak/20/bin/node';
$server_js = $app_path . '/server.js';

echo "\n--- 1. Checking stderr.log inside App Root ---\n";
$stderr_log = $app_path . '/stderr.log';
if (file_exists($stderr_log)) {
    echo "Found stderr.log (" . filesize($stderr_log) . " bytes):\n";
    $lines = file($stderr_log);
    $last_lines = array_slice($lines, -50);
    echo implode("", $last_lines) . "\n";
} else {
    echo "stderr.log not found in $app_path\n";
}

echo "\n--- 2. Checking node_modules and package.json ---\n";
if (is_dir($app_path . '/node_modules')) {
    echo "node_modules exists.\n";
    // Check if express and cors are installed
    echo "Express exists: " . (is_dir($app_path . '/node_modules/express') ? "Yes" : "No") . "\n";
    echo "Cors exists: " . (is_dir($app_path . '/node_modules/cors') ? "Yes" : "No") . "\n";
} else {
    echo "node_modules NOT found!\n";
}

echo "\n--- 3. Manual Node.js Startup Test ---\n";
if (file_exists($node_bin) && file_exists($server_js)) {
    $descriptorspec = array(
       0 => array("pipe", "r"),
       1 => array("pipe", "w"),
       2 => array("pipe", "w")
    );
    $process = proc_open("$node_bin $server_js", $descriptorspec, $pipes);
    if (is_resource($process)) {
        fclose($pipes[0]);
        stream_set_blocking($pipes[1], 0);
        stream_set_blocking($pipes[2], 0);
        
        usleep(2000000); // 2 seconds
        
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        
        $status = proc_get_status($process);
        echo "Process status: " . ($status['running'] ? "Running" : "Stopped (Exit: " . $status['exitcode'] . ")") . "\n";
        
        proc_terminate($process);
        proc_close($process);
        
        echo "\nSTDOUT:\n" . ($stdout ? $stdout : "(no output)") . "\n";
        echo "\nSTDERR:\n" . ($stderr ? $stderr : "(no output)") . "\n";
    } else {
        echo "proc_open failed\n";
    }
}

?>
