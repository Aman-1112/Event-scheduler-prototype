const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');

// util,crypto is node's built-in module
const util = require('util');
const crypto = require('crypto');

const sendingMail = require('../utils/sendEmail');

exports.Signup = async (req, res) => {
	try {
		//here object destructuring is used so user cannot decide role on their own
		const { name, email, password, confirmPassword, gender } = req.body;
		const user = await userModel.create({
			name,
			email,
			password,
			confirmPassword,
			gender
		});

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
			throw new Error('Insufficient Credentials:Please provide email and password');

		const user = await userModel.findOne({ email }).select('+password');
		// checking if user of that email exist on db
		// but not giving hacker any idea of what field is wrong
		if (!user) throw new Error('invalid email or password');

		// checking for password
		// using instance method
		if (!(await user.verifyPassword(password)))
			throw new Error('invalid email or password');

		// if login success then send token
		const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
			expiresIn: 30 * 24 * 60 * 60 * 1000 //30 days
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
	// checking if header contains token or not
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new Error('You do not have permission to access this route'));
	}
	// validating token
	try {
		// node's util library provide promisify method
		// which is used to promisify the function i.e. will return promise
		const decoded_payload = await util.promisify(jwt.verify)(
			token,
			process.env.SECRET_KEY
		);

		// checking if user of such id exist in db
		// becoz someone may be using stolen jwt old token
		const user = await userModel.findById(decoded_payload.id);
		if (!user) throw new Error('user belonging to token no longer exist');

		// check if password changed after jwt was issued
		// becoz someone may have stolen jwt
		// using instance method
		if (
			user.passwordChangedAt &&
			user.PasswordChangeAfterJwtIat(decoded_payload.iat)
		) {
			throw new Error('Password has been changed by user...pls login again');
		}
		// passing down the data from one middleware to another middleware
		// by attaching data to req. object
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
};

// to pass the arguments (here roles) to a middleware
// use wrapper function (here onlyAllowed)
exports.onlyAllowed = (...roles) => {
	// returns middleware
	return function (req, res, next) {
		if (!roles.includes(req.user.role)) {
			return next(new Error('You do not have permission to access this route'));
		}
		next();
	};
};

exports.forgotPassword = async (req, res) => {
	try {
		const user = await userModel.findOne({ email: req.body.email });
		// checking for the valid email and getting user
		if (!user) throw new Error('Invalid Email');

		// generate resetToken
		const resetToken = await user.generateResetToken();
		try {
			// setting validateBeforeSave option to false won't check for
			// 1.required 2.all validation
			await user.save({ validateBeforeSave: false });

			// sending the resetPasswordLink to the email
			const resetLink = `${req.protocol}://${req.get(
				'host'
			)}/api/v1/users/resetPassword/${resetToken}`;
			const message =
				'Reset your password through given below link (valid for 5min)';

			const whatsthis = await sendingMail({
				receiver: req.body.email,
				subject: message,
				text: resetLink
			});
			//? console.log('whatsthis', whatsthis);

			res.status(200).json({
				status: 'success',
				message: 'reset Link send to your Email'
			});
		} catch (e) {
			user.passwordResetToken = undefined;
			user.passwordResetTokenExpiry = undefined;
			console.log(e);
			res.status(400).json({
				status: 'fail',
				error: e.message
			});
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const resetToken = req.params.resetToken;
		const hashedresetToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		// comparing hashed token along with token expiry
		let user = await userModel.findOne({
			passwordResetToken: hashedresetToken,
			passwordResetTokenExpiry: { $gte: Date.now() }
		});

		if (!user) throw new Error('Invalid token or token has been expired');

		// updating with the new password
		user.password = req.body.password;
		user.confirmPassword = req.body.confirmPassword;
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpiry = undefined;

		// added pre save middleware to update passwordChangedAt field

		// setting passwordChangedAt before token generation
		await user.save();

		// creating the token and sending it
		const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
			expiresIn: 30 * 24 * 60 * 60 * 1000 //30 days
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

exports.updateMyPassword = async (req, res, next) => {
	try {
		// getting user on req object with the help of TokenValidation middleware
		const user = await userModel.findById(req.user._id).select('+password');

		// matching older password
		if (!(await user.verifyPassword(req.body.current_password)))
			throw new Error("current password didn't match ...please try again");

		user.password = req.body.new_password;
		user.confirmPassword = req.body.new_confirmPassword;

		await user.save();
		// using .save() instead of findByIdandUpdate coz
		// it will run all validators
		// runs all pre-save middlewares (password encryption & passwordChangedAt)

		const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
			expiresIn: 30 * 24 * 60 * 60 * 1000 //30 days
		});

		res.status(200).json({
			status: 'success',
			message: 'password updated successfully',
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

exports.updateMyDetails = async (req, res) => {
	try {
		// check if bad user trying to change the password field
		if (req.body.password || req.body.confirmPassword)
			throw new Error(
				'Password cannot be updated here ..pls go to /updateCurrentPasword'
			);

		// removing the fields that bad user not allowed to change
		for (let prop in req.body) {
			if (!['name', 'email', 'gender'].includes(prop)) {
				delete req.body[prop];
			}
		}

		// updating details
		// pre-save-middlewares not required so didn't use .save()
		const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
			new: true,
			runValidators: true
		});

		res.status(200).json({
			status: 'success',
			user
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.deleteMyAccount = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id).select('+password');

		if (!(await user.verifyPassword(req.body.password)))
			throw new Error("password didn't match ...please try again");

		await userModel.findByIdAndDelete(user._id);

		res.status(204).json({
			status: 'success'
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

// .save() v/s findbyId&Update

// .save() check for
// required ✅
// other validation✅

// (findbyId&Update) or (.save()+ validateBeforeSave:false)
// required❌
// other validation❌

// findbyId&Update + runValidators:true
// required❌
// other validation✅
