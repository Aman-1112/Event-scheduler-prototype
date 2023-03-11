//loads the environment variables from file to process.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const CustomError=require('./utils/errorHandler');

//used mongoose(mongodb driver) to connect to our database(mongodb)
mongoose
	.connect(process.env.LOCAL_DATABASE)
	.then(() => console.log('connected to local database'))
	.catch((err) => console.error(err));

const eventRouter = require('./Routes/eventRoute');
const userRouter = require('./Routes/userRoute');
app.use(express.json());

//! app.use used to apply middleware
//whenver this route hits with req then corresponding router(middleware) runs
app.use('/api/v1', eventRouter);
app.use('/api/v1/users', userRouter);

//.all accepts all type of HTTP requests
app.all('*', (req, res, next) => {
	next(new CustomError("This route does not exist on the server",404))
});

//middleware with four parameter express automatically identify as
//central custom error handling middlware
//otherwise , express would have used it's default one
app.use((cerr, req, res, next) => {
	//? this runs two time why
	console.log("Error Handling Middleware ranned");
	res.status(cerr.statusCode ).json({
		status: 'fail',
		statusCode:cerr.statusCode,
		message: cerr.message
	});
});

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server listening to port:${port}...`);
});
