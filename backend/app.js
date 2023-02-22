require('dotenv').config({path : './config/.env'})
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const auth = require("./middlewares/userAuth")
const connectDB = require('./config/db')

const app = express()

//# middlewares
app.use(express.json())
app.use(morgan("tiny"))
app.use(require('cors')())

// # routes
app.get("/protected", auth , (req , res) =>{
    return res.status(200).json({...req.user._doc}); 
})
app.get("/",(req,res)=>{
    res.send("hello world")
})

// # Main routes
app.use('/', require('./routes/userAuth'))
app.use('/', require('./routes/contact'))

// @ server configuration
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
    try {
        await connectDB()
    console.log(`server is listening on port: ${PORT}`)
    } catch (error) {
        console.log(error)
    }
})