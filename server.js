//loads the environment variables from file to process.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
//used mongoose(mongodb driver) to connect to our database(mongodb)
mongoose
.connect(process.env.LOCAL_DATABASE)
.then(() => console.log('connected to local database'))
.catch((err) => console.error(err));

const viewRouter = require('./Routes/viewRoute');
const eventRouter = require('./Routes/eventRoute');
const userRouter = require('./Routes/userRoute');
const bookingRouter = require('./Routes/bookingRoute');

//parses the data from body
app.use(express.json());
//parses the data from cookie
app.use(cookieParser());

//setting up view engine
app.set('view engine','pug');
app.set('views',path.join(__dirname,'Views'));
app.use(express.static(path.join(__dirname,'public')))


//routes
//! app.use used to apply middleware
//whenver this route hits with req then corresponding router(middleware) runs
app.use('/api/v1', eventRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1',bookingRouter)
app.use('/',viewRouter);


//.all accepts all type of HTTP requests
app.all('*', (req, res, next) => {
	next(new CustomError("This route does not exist on the server",404))
});

const CustomError=require('./utils/errorHandler');
//middleware with four parameter express automatically identify as
//Gloabal custom error handling middlware
//otherwise , express would have used it's default one
app.use((cerr, req, res, next) => {
	//? this runs two time why
	console.log("Custom Global Error Handling Middleware raaaned");
	
	cerr.statusCode = cerr.statusCode||500;
	cerr.message = cerr.message||'Something went wrong';

	if(req.originalUrl.startsWith('/api')){
		//for api
		res.status(cerr.statusCode ).json({
			status: 'fail',
			statusCode:cerr.statusCode,
			message:cerr.message
		});
	}else{
		//for rendering page
		res.status(cerr.statusCode).render('error',{
			title:cerr.message
		});
	}
});

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server listening to port:${port}...`);
});
