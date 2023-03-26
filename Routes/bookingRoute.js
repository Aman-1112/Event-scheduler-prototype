const express = require('express');
const bookingRouter = express.Router();
const bookingController = require('../Controllers/bookingController');
// const { TokenAuthentication } = require('../Controllers/authController');
const authController = require('../Controllers/authController');

bookingRouter.get('/checkout-session/:eventId',authController.TokenAuthentication,bookingController.getCheckoutSession)

module.exports = bookingRouter;