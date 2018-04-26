# File Growth Rate Analyzer
node script to determine file growth rate by reading stdin (such as tailing a log file) and reporting on the number of lines and overall growth rate of the file.

## Example Usage
```
$ tail -f logFile.txt | node analyzeFileGrowth.js -v
```

## Options
-v / --verbose: reports additional info such as throughput rate (bytes / s), elapsed time per run  and file size (bytes)