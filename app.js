require('dotenv').config()
// async errors
require('express-async-errors');


const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const productRouter = require('./routes/products')


const notFoundMiddleware = require('./middlewares/not-found');
const errorMiddleware = require('./middlewares/error-handler');


// middleware
app.use(express.json())

// routes

app.get('/', (req, res) =>{
    res.send('<h1>Store API</h1> <a href= "/api/v1/products">products route</a>')
})


app.use('/api/v1/products', productRouter)
// product route



app.use(notFoundMiddleware)
app.use(errorMiddleware)


const PORT = process.env.PORT || 4000

const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`server listening on port ${PORT}`))
    } catch(error){
        console.log(error)
    }
}

start();