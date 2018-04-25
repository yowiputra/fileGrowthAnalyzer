const fs = require('fs');

let contentString = 'test test test'

writeToTestText = () => {
  fs.writeFile('testText.md', contentString, (err) => {
    if (err) throw err;
    console.log('writing...')
  })
  contentString += '\ntest test test'
}

setInterval(writeToTestText, Math.random() * 2000);
