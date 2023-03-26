const { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent, cheapAndLiveMiddleware,getEventStats,handleUploadedEventPhoto,resizeUploadedEventPhoto, bookingTicket } = require('../Controllers/eventController');
const { TokenAuthentication,onlyAllowed} = require('../Controllers/authController');
const express = require('express');
const eventRouter = express.Router();

// sub-route
eventRouter
.route('/events')
// httpmethod(handler function)
.get(getAllEvents)//added tokenAuth middleware to protect the route
.post(TokenAuthentication,handleUploadedEventPhoto,resizeUploadedEventPhoto,createEvent)//? insert mw = onlyAllowed("organiser","admin")


eventRouter
.route('/event/:eventId')
.get(getEvent)
.patch(updateEvent)
.delete(TokenAuthentication,onlyAllowed("admin"),deleteEvent)

eventRouter
.route(onlyAllowed("admin"),'/events/stats')
.get(getEventStats)

// alias route
eventRouter
.route('/events/cheap-live-events')
// added middleware in middleware stack
//?where to add middleware 
.get(cheapAndLiveMiddleware,getAllEvents)

module.exports = eventRouter;
