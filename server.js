//loads the environment variables from file to process.env
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const express = require('express');
const app=express();

app.get('/',(req,res)=>{
    res.send('Hello World');
})

const port =process.env.PORT;
app.listen(port,()=>{
    console.log(`Server listening to port:${port}...`)
})