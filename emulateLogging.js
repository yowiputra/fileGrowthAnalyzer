const fs = require('fs');

let contentString = 'test test test'

writeToTestText = () => {
  fs.writeFile('testText.md', contentString, (err) => {
    if (err) throw err;
    console.log('writing...')
  })
  contentString += '\ntest test test'
}

// emulating logging at a write speed of 1 line / s
// output of analyzeFileGrowth.js should come close to around 1 line / s when running both scripts together
setInterval(writeToTestText, 1000);
