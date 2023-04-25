/**
 * Antonio Balanzategui, 4/25/2023
 */
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 8000
const connectDatabase = require('./config/db')
const router = require('./routes/routes')
const cors = require('cors')

connectDatabase()

const app = express()

// Enable CORS for all routes, essentially makes it so that we can fetch data from a seperate localhost port
app.use(cors())

// Mount the router at the '/api/data' route
app.use('/api/data', router) 

app.listen(port, () => console.log(`Server started on port ${port}`.magenta))
