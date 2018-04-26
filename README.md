# File Growth Rate Analyzer
Node script to determine file growth rate by reading stdin (such as tailing a log file) and reporting on the number of lines and overall growth rate of the file.

## Example Usage
```
$ tail -f logFile.txt | node analyzeFileGrowth.js -v
```

## Options
-v / --verbose: reports additional info such as throughput rate (bytes / s), elapsed time per run  and file size (bytes)

## Test
``` 
node emulateLogging.js
```
Then on a different terminal, run:
```
$ tail -f testText.md | node analyzeFileGrowth.js -v
```
Since `emulateLogging.js` is set to 1 second intervals, the file growth rate on the output of `analyzeFileGrowth.js` should come around to 1 line / s. Number of lines will go from 1 and start incrementing by 1 every second.