const eventModel = require('../Models/eventModel');
const CustomError = require('../utils/errorHandler')

exports.home = async (req,res)=>{
	const events = await eventModel.find();
	res.status(200).render('home',{
		title:'home',
		events
	});
}

//? why seperate why api is not integrated
exports.eventDetail = async (req,res,next)=>{
	try{
		const eventId=req.params.id;
		const event = await eventModel.findById(eventId).populate({path:'organiser',select:"name email photo"});
		// console.log(event)
		res.status(200).render('edetail',{
			title:'event',
			event
		});
	}catch(err){
		next(new CustomError('Page you are looking for does not exist',404));
	}
}

exports.getLoginForm = async(req,res)=>{
	res.status(200).render('login',{
		title:'login'
	})
}

exports.getSignupForm = async(req,res)=>{
	res.status(200).render('signup',{
		title:'signup'
	})
}

exports.getForgotPasswordForm = (req,res)=>{
	res.status(200).render('forgotPassword',{
		title:'forgot password'
	})
}

exports.getResetPasswordForm = (req,res)=>{
	res.status(200).render('resetPassword',{
		title:'reset password'
	})
}

exports.getProfile = (req,res)=>{
	res.status(200).render('profile',{
		title:'profile',
	})
}

//user data passed through res.locals.body


exports.getCreateEventForm =(req,res)=>{
	res.status(200).render('createEvent',{
		title:'create event'
	})
}