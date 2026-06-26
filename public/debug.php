<?php
header('Content-Type: text/plain');

echo "=== RAKIYAWAK PROCESS KILLER ===\n";

if (function_exists('shell_exec')) {
    echo "--- Node processes BEFORE kill ---\n";
    echo shell_exec('ps aux | grep -i node');
    
    echo "\nExecuting kill commands...\n";
    // Kill processes matching lsnode or node
    shell_exec('pkill -9 -f lsnode');
    shell_exec('pkill -9 -f node');
    
    // Wait 1 second
    sleep(1);
    
    echo "\n--- Node processes AFTER kill ---\n";
    echo shell_exec('ps aux | grep -i node');
} else {
    echo "ERROR: shell_exec is disabled, cannot kill processes.\n";
}

?>
