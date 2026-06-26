<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK TIMEOUT PORT TEST ===\n";

$node_bin = '/home/rakiyawa/nodevenv/repositories/rakiyawak/20/bin/node';
$server_js = '/home/rakiyawa/repositories/rakiyawak/server.js';

if (file_exists($node_bin) && file_exists($server_js)) {
    echo "Running Node server via 'timeout 5s' to capture all output...\n";
    
    $cmd = "timeout 5s $node_bin $server_js 2>&1";
    $output = array();
    $retval = -1;
    
    exec($cmd, $output, $retval);
    
    echo "Exit code: $retval\n";
    echo "Combined Output (STDOUT + STDERR):\n";
    if (empty($output)) {
        echo "(no output received)\n";
    } else {
        echo implode("\n", $output) . "\n";
    }
} else {
    echo "ERROR: node or server.js not found\n";
}

?>
