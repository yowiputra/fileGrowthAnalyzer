const { Transform } = require('stream');

const option = process.argv[2];
const overallTime = process.hrtime();

// global variables
const options = ['-v', '--verbose']
let startTime = null;
let initTotalLine = 0;

parseHrtimeToSeconds = (hrtime) => {
  // hrtime[0] in seconds, hrtime[1] in nanoseconds therefore need to convert
  const seconds = hrtime[0] + (hrtime[1] / 1e9);
  return seconds;
}

const textAnalysis = new Transform({
  readableObjectMode: true,
  transform(chunk, encoding, callback) {
    // create return object
    const obj = {
      elapsedTime: parseHrtimeToSeconds(process.hrtime(startTime)),
      byteLength: Buffer.byteLength(chunk, 'utf8'),
      totalLines: chunk.toString().split('\n').length
    };

    // reset startTime
    startTime = null;

    // put initial totalLines in totalLineHistory
    if (initTotalLine === 0) {
      initTotalLine = obj.totalLines;
    }

    this.push(obj);
    callback();
  }
});

const objectToString = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    // calculate throughput rate
    const throughputRate = (chunk.byteLength / chunk.elapsedTime).toFixed(0);

    // calculate file growth rate
    // NOTE: this calculates OVERALL growth rate of the file (difference between current total lines and lines at the beginning of script execution over total time elapsed since script execution)
    const lineDiff = chunk.totalLines - initTotalLine;
    const overallTimeInSeconds = parseHrtimeToSeconds(process.hrtime(overallTime));
    const growthRate = (lineDiff / overallTimeInSeconds).toFixed(2);

    let reportString = `Number of lines: ${chunk.totalLines} lines\nFile growth rate: ${growthRate} lines / s`;

    // check if option exists, if so, apply
    if (option) {
      switch(option) {
        case '-v':
        case '--verbose':
          reportString += `\nThroughput rate: ${throughputRate} bytes / s\nElapsed time: ${chunk.elapsedTime.toFixed(6)} s\nFile size: ${chunk.byteLength} bytes`;
          break;
        default:
      }
    }
    
    this.push(reportString + '\n\n');
    callback();
  }
});

// validate option
if (option && !options.includes(option)) {
  throw new Error('option not recognized')
}

process.stdin
  .setEncoding('utf8')
  .on('data', () => startTime = process.hrtime())
  .pipe(textAnalysis)
  .pipe(objectToString)
  .pipe(process.stdout)