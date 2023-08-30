const mongoose = require('mongoose')
require('dotenv').config()
const DB_CONNECT = process.env.DB_CONNECT

async function connectDB() {
    if(!DB_CONNECT) {
        console.log('DB_CONNECT is not set')
        process.exit(1)
    }
    mongoose.connect(DB_CONNECT)
    mongoose.connection.on('connected',()=>{
        console.log('DB connected')
    })
    mongoose.connection.on('error',()=>{
        console.log('DB connection error')
        process.exit(2)
    })
    mongoose.connection.on('disconnected',()=>{
        console.log('DB disconnected')
        process.exit(3)
    })
}

module.exports = connectDB