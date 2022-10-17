const { getAllEvents, createEvent } = require('../Controllers/eventController');
const express = require('express');
const eventRouter = express.Router();

//sub-route
eventRouter
.route('/events')
//httpmethod(handler function)
.get(getAllEvents)
.post(createEvent)

module.exports = eventRouter;
