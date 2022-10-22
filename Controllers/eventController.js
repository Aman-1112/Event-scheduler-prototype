//all handler functions

const eventModel = require('../Models/eventModel');
const ApiFeatures = require('../utils/apifeatures');

exports.cheapAndLiveMiddleware = (req, res, next) => {
	const todayDate = new Date();
	req.query.start = { gte: todayDate };
	req.query.sort = 'entryFee';
	req.query.fields = 'title venue start end entryFee ';
	next();
};

exports.getAllEvents = async (req, res) => {
	try {
		// if we await for the method on Model then it returns result e.g. await eventModel.find()
		// and if we don't then it returns document/instance(obj) of model/query object e.g. eventModel.find()
		// to this query object multiple query chaining is possible like .skip,.limit,.sort ...

		let apifeatures = new ApiFeatures(eventModel.find(), req.query)
			.filter()
			.pagination()
			.sorting()
			.projection();
		// new ApiFeatures() return object
		// onto which method can be applied
		// method chaining is possible only because each method return this(i.e. current_object)

		//! awaiting means to execute the query /query object
		const events = await apifeatures.query;
		res.status(200).json({
			status: 'success',
			results: events.length,
			body: events,
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message,
		});
	}
};

exports.createEvent = async (req, res) => {
	try {
		const event = await eventModel.create(req.body);
		res.status(200).json({
			status: 'success',
			results: event.length,
			body: event,
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message,
		});
	}
};

exports.getEvent = async (req, res) => {
	try {
		const id = req.params.eventId;
		const event = await eventModel.findById(id);

		if (event == null) throw new Error(`event of id: ${id} doesn't exist`);

		res.status(200).json({
			status: 'success',
			body: event,
		});
	} catch (e) {
		console.error(e);
		res.status(404).json({
			status: 'fail',
			error: e.message,
		});
	}
};

exports.updateEvent = async (req, res) => {
	try {
		console.log('req.body', req.body);
		const id = req.params.eventId;
		const event = await eventModel.findByIdAndUpdate(id, req.body, {
			runValidators: true,
			new: true,
		});

		if (event == null) throw new Error(`event of id: ${id} doesn't exist`);

		res.status(201).json({
			status: 'success',
			body: event,
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message,
		});
	}
};

exports.deleteEvent = async (req, res) => {
	try {
		const id = req.params.eventId;
		const event = await eventModel.findByIdAndDelete(id);
		res.status(204).json({
			status: 'success',
			body: event,
		});

		if (event == null) throw new Error(`event of id: ${id} doesn't exist`);
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message,
		});
	}
};

//Tips:

//nested object searched through dot operator like .find({"venue.city"="delhi"});

//select
//"entryFee -_id" ✅
//"entryFee title"✅
//"-entryFee -title"✅
//"entryFee -title" ❌
