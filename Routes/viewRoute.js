const {home, eventDetail,getLoginForm, getSignupForm,getForgotPasswordForm,getResetPasswordForm,getProfile,getCreateEventForm} = require('../Controllers/viewController');
const {isLoggedIn, TokenAuthentication} = require('../Controllers/authController')
const express = require('express')
const viewRouter = express.Router();

//before each route this middleware will added to middlewareStack
viewRouter.use(isLoggedIn);

viewRouter.get('/',home);
viewRouter.get('/event/:id',eventDetail);
viewRouter.get('/login',getLoginForm);
viewRouter.get('/signup',getSignupForm);
viewRouter.get('/forgotPassword',getForgotPasswordForm);

viewRouter.get('/profile',TokenAuthentication,getProfile);
viewRouter.get('/createEvent',TokenAuthentication,getCreateEventForm);
//?unsafe
viewRouter.get('/resetPassword',getResetPasswordForm);


module.exports = viewRouter;