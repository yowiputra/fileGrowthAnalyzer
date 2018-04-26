const { Transform } = require('stream');

const option = process.argv[2];
const overallTime = process.hrtime();

// global variables
const options = ['-v', '--verbose']
let initByteLength = 0;
let initTotalLines = 0;

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
      elapsedTime: parseHrtimeToSeconds(process.hrtime(overallTime)),
      byteLength: Buffer.byteLength(chunk, 'utf8'),
      totalLines: chunk.toString().split('\n').length
    };

    // set initial byteLength
    if (initByteLength === 0) {
      initByteLength = obj.byteLength;
    }

    // set initial totalLines
    if (initTotalLines === 0) {
      initTotalLines = obj.totalLines;
    }

    this.push(obj);
    callback();
  }
});

const objectToString = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    // calculate overall growth rate (bytes / s)
    const growthRateInBytes = ((chunk.byteLength - initByteLength) / chunk.elapsedTime).toFixed(0);
    
    // calculate overall growth rate (lines / s)
    const growthRateInLines = ((chunk.totalLines - initTotalLines) / chunk.elapsedTime).toFixed(2);

    let reportString = `Number of lines: ${chunk.totalLines} lines\nGrowth rate: ${growthRateInBytes} bytes / s`;

    // check if option exists, if so, apply
    if (option) {
      switch(option) {
        case '-v':
        case '--verbose':
          reportString += `\nGrowth rate: ${growthRateInLines} lines / s\nElapsed time: ${chunk.elapsedTime.toFixed(2)} s\nFile size: ${chunk.byteLength} bytes`;
          break;
        default:
      }
    }
    
    this.push(reportString + '\n\n');
    callback();
  }
});

executeScript = (inputStream, outputStream) => {
  inputStream  
    .pipe(textAnalysis)
    .pipe(objectToString)
    .pipe(outputStream)
}

// validate option
if (option && !options.includes(option)) {
  throw new Error('option not recognized')
}

const inputStream = process.stdin.setEncoding('utf8')

executeScript(inputStream, process.stdout)