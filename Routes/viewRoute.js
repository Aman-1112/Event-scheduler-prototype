const {home, eventDetail,getLoginForm, getSignupForm,getForgotPasswordForm,getResetPasswordForm,getProfile,getCreateEventForm,getUpdateEventForm} = require('../Controllers/viewController');
const {isLoggedIn, TokenAuthentication, onlyAllowed} = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');
const express = require('express')
const viewRouter = express.Router();

//before each route this middleware will added to middlewareStack
viewRouter.use(isLoggedIn);

//ticket booked -> success -> /route -> ifhasqueryparams bookindb -> /route -> no query ->home
viewRouter.get('/',bookingController.createBooking,home);

viewRouter.get('/event/:id',eventDetail);
viewRouter.get('/login',getLoginForm);
viewRouter.get('/signup',getSignupForm);
viewRouter.get('/forgotPassword',getForgotPasswordForm);

viewRouter.get('/profile',TokenAuthentication,getProfile);
viewRouter.get('/createEvent',TokenAuthentication,onlyAllowed('organiser','admin'),getCreateEventForm);
viewRouter.get('/updateEvent/:eventId',TokenAuthentication,onlyAllowed('organiser','admin'),getUpdateEventForm);

//?unsafe
viewRouter.get('/resetPassword/:resetToken',getResetPasswordForm);


module.exports = viewRouter;