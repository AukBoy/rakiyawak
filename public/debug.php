<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK NODE BINARY TEST ===\n";

$node_bin = '/home/rakiyawa/nodevenv/repositories/rakiyawak/20/bin/node';
$server_js = '/home/rakiyawa/repositories/rakiyawak/server.js';

echo "Node binary: $node_bin\n";
echo "Server file: $server_js\n\n";

if (file_exists($node_bin)) {
    echo "1. Checking Node version...\n";
    $output = array();
    $retval = -1;
    exec("$node_bin -v 2>&1", $output, $retval);
    echo "Exit code: $retval\n";
    echo "Output:\n" . implode("\n", $output) . "\n\n";
} else {
    echo "ERROR: Node binary not found.\n\n";
}

if (file_exists($node_bin) && file_exists($server_js)) {
    echo "2. Checking server.js syntax or startup...\n";
    $output = array();
    $retval = -1;
    // Run node in check mode if supported, or just print version and run a quick test
    exec("$node_bin -c $server_js 2>&1", $output, $retval);
    echo "Syntax check exit code (0 means OK): $retval\n";
    echo "Syntax check output:\n" . implode("\n", $output) . "\n\n";
    
    echo "3. Running server.js for a split second to see errors...\n";
    // We run it with a timeout of 2 seconds
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
        
        usleep(1500000); // 1.5 seconds
        
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        
        $status = proc_get_status($process);
        echo "Process status:\n";
        print_r($status);
        
        proc_terminate($process);
        proc_close($process);
        
        echo "\nSTDOUT:\n" . ($stdout ? $stdout : "(no output)") . "\n";
        echo "\nSTDERR:\n" . ($stderr ? $stderr : "(no output)") . "\n";
    } else {
        echo "proc_open failed\n";
    }
}

?>
