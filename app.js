const path = require('path')
const envPath = path.join(__dirname, './.env')
require('dotenv').config({ path: envPath })
const express = require("express")
const app = express()
const port = process.env.expressPort

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})