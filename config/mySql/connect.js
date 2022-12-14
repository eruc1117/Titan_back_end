const path = require('path')
const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath })
const  mysql  =  require ( 'mysql2' ) ; 
const config = ({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password
})

module.exports = mysql.createPool(config)