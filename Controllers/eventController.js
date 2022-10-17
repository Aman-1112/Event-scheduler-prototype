//all handler functions
const eventModel = require('../Models/eventModel');

exports.getAllEvents = async (req, res) => {
	try {
		const event = await eventModel.find();
		res.status(200).json({
			status: 'success',
			results: event.length,
			body: event,
		});
	} catch (e) {
		console.error(e);
		res.status(400).send(e.message);
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
		console.log('😖:' + e.message);
		res.status(400).send(e.message);
	}
};
