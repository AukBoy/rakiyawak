<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK LIVE PORT TEST ===\n";

$node_bin = '/home/rakiyawa/nodevenv/repositories/rakiyawak/20/bin/node';
$server_js = '/home/rakiyawa/repositories/rakiyawak/server.js';

if (file_exists($node_bin) && file_exists($server_js)) {
    $descriptorspec = array(
       0 => array("pipe", "r"),
       1 => array("pipe", "w"),
       2 => array("pipe", "w")
    );
    
    echo "Starting Node.js server manually on port 5000...\n";
    $process = proc_open("$node_bin $server_js", $descriptorspec, $pipes);
    
    if (is_resource($process)) {
        fclose($pipes[0]);
        stream_set_blocking($pipes[1], 0);
        stream_set_blocking($pipes[2], 0);
        
        // Wait 1.5 seconds for startup
        usleep(1500000);
        
        echo "Sending test request to http://127.0.0.1:5000/ ...\n";
        $options = array(
            'http' => array(
                'method'  => 'GET',
                'timeout' => 5,
                'ignore_errors' => true
            )
        );
        $context  = stream_context_create($options);
        $response = file_get_contents('http://127.0.0.1:5000/', false, $context);
        
        echo "Response headers from test request:\n";
        if (isset($http_response_header)) {
            print_r($http_response_header);
        } else {
            echo "(no headers)\n";
        }
        echo "\nResponse body from test request:\n";
        echo $response ? substr($response, 0, 500) : "(empty response)\n";
        
        // Wait another 1 second to capture any crash logs in stderr
        usleep(1000000);
        
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        
        $status = proc_get_status($process);
        echo "\nProcess status: " . ($status['running'] ? "Running" : "Stopped (Exit: " . $status['exitcode'] . ")") . "\n";
        
        proc_terminate($process);
        proc_close($process);
        
        echo "\n--- STDOUT ---\n";
        echo $stdout ? $stdout : "(no stdout)\n";
        echo "\n--- STDERR ---\n";
        echo $stderr ? $stderr : "(no stderr)\n";
    } else {
        echo "proc_open failed\n";
    }
} else {
    echo "ERROR: node or server.js not found\n";
}

?>
