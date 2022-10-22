const { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent, cheapAndLiveMiddleware } = require('../Controllers/eventController');
const express = require('express');
const eventRouter = express.Router();

//sub-route
eventRouter
.route('/events')
//httpmethod(handler function)
.get(getAllEvents)
.post(createEvent)

eventRouter
.route('/event/:eventId')
.get(getEvent)
.patch(updateEvent)
.delete(deleteEvent)

// alias route
eventRouter
.route('/events/cheap-live-events')
// added middleware in middleware stack
//?where to add middleware 
.get(cheapAndLiveMiddleware,getAllEvents)

module.exports = eventRouter;
