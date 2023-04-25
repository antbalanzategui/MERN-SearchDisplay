/**
 * Antonio Balanzategui, 4/25/2023
 */
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

/**
 * Establish Scheme for mongoose to receive particular data
 */
const WeekSchema = new mongoose.Schema({
  Week: String,
  javascript: Number,
  python: Number,
  java: Number
})

const Week = mongoose.model('Week', WeekSchema)

/**
 * Refers to /api/data, can be seen within the server.js file
 * This is how we are receiving data from the mongoDB
 */
router.get('/', async (req, res) => {
  try {
    // The next two lines is to remove unessecary data from the query
    const weeks = await Week.find({}, { _id: 0, data: 1 }).lean()
    const data = weeks.flatMap(week => week.data)
    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
})

module.exports = router
