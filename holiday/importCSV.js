const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputFile = path.resolve(__dirname, "./holiday.csv");
let results = []

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });