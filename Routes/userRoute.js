const {
	Signup,
	Login,
	forgotPassword,
	resetPassword,
	TokenAuthentication,
	onlyAllowed,
	updateMyPassword,
	updateMyDetails,
	deleteMyAccount,
	Logout
} = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const express = require('express');
const userRouter = express.Router();

userRouter.post('/signup',userController.handleUploadedPhoto,userController.resizeUploadedPhoto, Signup);
userRouter.post('/login', Login);
userRouter.get('/logout',Logout);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:resetToken', resetPassword);

//updating password for loggedIn user
userRouter.patch('/updateMyPassword', TokenAuthentication, updateMyPassword);
userRouter.patch('/updateMyDetails', TokenAuthentication,userController.handleUploadedPhoto,userController.resizeUploadedPhoto, updateMyDetails);
userRouter.delete('/deleteMyAccount', TokenAuthentication, deleteMyAccount);

userRouter.route('/').get(onlyAllowed("admin"),userController.getAllUsers);

module.exports = userRouter;
