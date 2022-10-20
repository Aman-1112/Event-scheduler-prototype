const { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent } = require('../Controllers/eventController');
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

module.exports = eventRouter;
