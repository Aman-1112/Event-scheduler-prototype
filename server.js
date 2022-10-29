//loads the environment variables from file to process.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//used mongoose(mongodb driver) to connect to our database(mongodb)
mongoose
	.connect(process.env.LOCAL_DATABASE)
	.then(() => console.log('connected to local database'))
	.catch((err) => console.error(err));

const eventRouter = require('./Routes/eventRoute');
const userRouter = require('./Routes/userRoute')
app.use(express.json());

//! app.use used to apply middleware
//whenver this route hits with req then corresponding router(middleware) runs
app.use('/api/v1', eventRouter);
app.use('/api/v1/users',userRouter)

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server listening to port:${port}...`);
});
