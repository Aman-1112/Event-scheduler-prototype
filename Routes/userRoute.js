const { getAllUsers } = require('../Controllers/userController');
const {
	Signup,
	Login,
	forgotPassword,
	resetPassword,
	TokenAuthentication,
	updateMyPassword,
	updateMyDetails,
	deleteMyAccount
} = require('../Controllers/authController');

const express = require('express');
const userRouter = express.Router();

userRouter.post('/signup', Signup);
userRouter.post('/login', Login);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:resetToken', resetPassword);

//updating password for loggedIn user
userRouter.patch('/updateMyPassword', TokenAuthentication, updateMyPassword);
userRouter.patch('/updateMyDetails', TokenAuthentication, updateMyDetails);
userRouter.delete('/deleteMyAccount', TokenAuthentication, deleteMyAccount);

userRouter.route('/').get(getAllUsers);

module.exports = userRouter;
