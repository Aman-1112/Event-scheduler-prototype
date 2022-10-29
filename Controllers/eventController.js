//all handler functions

const eventModel = require('../Models/eventModel');
const ApiFeatures = require('../utils/apifeatures');

exports.cheapAndLiveMiddleware = (req, res, next) => {
	const todayDate = new Date();
	req.query.start = { gte: todayDate };
	req.query.sort = 'entryFee';
	req.query.fields = 'title venue start end entryFee ';

	// calls out the next middleware in stack
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
			body: events
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.createEvent = async (req, res) => {
	try {
		const event = await eventModel.create(req.body);
		res.status(200).json({
			status: 'success',
			results: event.length,
			body: event
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
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
			body: event
		});
	} catch (e) {
		console.error(e);
		res.status(404).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.updateEvent = async (req, res) => {
	try {
		console.log('req.body', req.body);
		const id = req.params.eventId;
		const event = await eventModel.findByIdAndUpdate(id, req.body, {
			runValidators: true,
			new: true
		});

		if (event == null) throw new Error(`event of id: ${id} doesn't exist`);

		res.status(201).json({
			status: 'success',
			body: event
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

exports.deleteEvent = async (req, res) => {
	try {
		const id = req.params.eventId;
		const event = await eventModel.findByIdAndDelete(id);
		res.status(204).json({
			status: 'success',
			body: event
		});

		if (event == null) throw new Error(`event of id: ${id} doesn't exist`);
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};

// aggregation pipeline
exports.getEventStats = async (req, res) => {
	try {
		// aggregate take array of stages
		// documents (from a collection) are passed through the pipeline of multiple stages
		// result of prev stage is passed down to current stage
		// so only certain fields are available

		const stats = await eventModel.aggregate([
			// stage 1
			// $aggregation pipeline operators or $mongodb_operators
			{
				$match: {
					start: { $gte: new Date() }
				}
			},
			// result of stage 1 is passed to stage2 (imp.)
			// stage 2
			{
				$group: {
					//! _id takes arg about which grouping is to be done
					//! others operators are accumulators only
					_id: { $month: '$start' },
					numEvents: { $sum: 1 },
					avgEntryFee: { $avg: '$entryFee' },
					minEntryFee: { $min: '$entryFee' },
					maxEntryFee: { $max: '$entryFee' },
					event: { $push: '$title' }
				}
			},
			// stage 3
			{
				$addFields: {
					month: {
						$let: {
							// define variable in vars
							vars: {
								monthsInString: [
									,
									'Jan',
									'Feb',
									'Mar',
									'Apr',
									'May',
									'Jun',
									'Jul',
									'Sep',
									'Oct',
									'Nov',
									'Dec'
								]
							},
							// used that vars in in
							in: {
								$arrayElemAt: ['$$monthsInString', '$_id']
								// [array_name,index] return element
							}
						}
					}
				}
			},
			// stage ..

			// 0 to hide
			// to show
			{
				$project: {
					_id: 0
				}
			},
			// ...
			{
				$sort: {
					avgEntryFee: 1,
					month: 1
				}
			}
		]);
		res.status(200).json({
			status: 'success',
			results: stats.length,
			body: stats
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
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
