const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');
// util is node's built-in module

const util = require('util');
exports.Signup = async (req, res) => {
	try {
		const user = await userModel.create(req.body);

		const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
			expiresIn: 600
		});

		res.status(200).json({
			status: 'success',
			token: token
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.Login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// checking if email && password is provided
		if (!email || !password)
			throw new Error(
				'Insufficient Credentials:Please provide email and password'
			);

		const user = await userModel.findOne({ email }).select('+password');
		//checking if user of that email exist on db
		// but not giving hacker any idea of what field is wrong
		if (!user) throw new Error('invalid email or password');

		//checking for password
		//using instance method
		if (!user.verifyPassword(password))
			throw new Error('invalid email or password');

		//if login success then send token
		const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
			expiresIn: 600
		});

		res.status(200).json({
			status: 'success',
			token
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.TokenAuthentication = async (req, res, next) => {
	let token;
	//checking if header contains token or not
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		//? how to create custom error handling for next(blah..)
		return next(new Error("You don't have permission to access this route"));
	}
	//validating token
	try {
		//node's util library provide promisify method
		//which is used to promisify the function i.e. will return promise
		const decoded_payload = await util.promisify(jwt.verify)(
			token,
			process.env.SECRET_KEY
		);

		//checking if user of such id exist in db
		//becoz someone may be using stolen jwt old token
		const user = await userModel.findById(decoded_payload.id);
		if (!user) throw new Error('user belonging to token no longer exist');

		//check if password changed after jwt was issued
		//becoz someone may have stolen jwt
		//using instance method
		if (
			user.passwordChangedAt &&
			user.PasswordChangeAfterJwtIat(decoded_payload.iat)
		) {
			throw new Error('Password has been changed by user...pls login again');
		}
	} catch (error) {
		console.log(error);
		next(error);
	}

	next();
};


exports.updateUser=async(req,res)=>{
	try {
		const id=req.params.id;
		const user=await userModel.findByIdAndUpdate(id,req.body,{runValidators:true})
		// user.save();❌
		//save middleware does ran for update

		// let user = await userModel.findById(id);
		// user={...user,...req.body};
		// user.save();
		//not working❌

		res.send(user);
	} catch (error) {
		res.send(error);
	}
}