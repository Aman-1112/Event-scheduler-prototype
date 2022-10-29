const { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent, cheapAndLiveMiddleware,getEventStats } = require('../Controllers/eventController');
const { TokenAuthentication} = require('../Controllers/authController');
const express = require('express');
const eventRouter = express.Router();

// sub-route
eventRouter
.route('/events')
// httpmethod(handler function)
.get(TokenAuthentication,getAllEvents)//added tokenAuth middleware to protect the route
.post(createEvent)

eventRouter
.route('/event/:eventId')
.get(getEvent)
.patch(updateEvent)
.delete(deleteEvent)

eventRouter
.route('/events/stats')
.get(getEventStats)

// alias route
eventRouter
.route('/events/cheap-live-events')
// added middleware in middleware stack
//?where to add middleware 
.get(cheapAndLiveMiddleware,getAllEvents)

module.exports = eventRouter;
