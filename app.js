const path = require('path')
const envPath = path.join(__dirname, './.env')
require('dotenv').config({ path: envPath })
const cors = require("cors")
const express = require("express")
const app = express()
const port = process.env.expressPort
const routes = require("./routes/index")

app.use(cors())

app.use(express.json())

app.use(routes)

app.listen(port, () => {
  console.log(`Web Service listening on port ${port}`)
})