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
setInterval(writeToTestText, 1000);
