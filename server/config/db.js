/**
 * Antonio Balanzategui, 4/25/2023
 */

/**
 * This file uses Mongoose to establish a DataBase connection using the MONGO_URI, which is
 * located inside the .env file, confirms connection via console.log in "npm run dev"
 */
const mongoose = require('mongoose')
const connectDatabase = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.red.underline)

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDatabase