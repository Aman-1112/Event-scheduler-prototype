//all handler functions
const e = require('express');
const eventModel = require('../Models/eventModel');

exports.getAllEvents = async (req, res) => {
	let excluded = ['page', 'limit', 'fields', 'sort'];
	try {
		//if we await for the method on Model then it returns result e.g. await eventModel.find()
		//and if we don't then it returns document/instance(obj) of model/query e.g. eventModel.find()
		
		//filtering
		let queryParams = { ...req.query };
		excluded.map((e) => delete queryParams[e]);
		
			// query with parameter
			queryInJson = JSON.stringify(queryParams);
			
			let regex = new RegExp(/\bgte|lte|gt|lt\b/, 'ig');
			queryInJson = queryInJson.replace(regex, (matched) => {
				return `$${matched}`;
			});
			queryParams = JSON.parse(queryInJson);
			
			//?{entryFee:{$lte:80}}
			//? string or number
			//? {entryFee:{'$lte':'80'}}

		let query = eventModel.find(queryParams);
		//to this query multiple query chaining is possible like .skip,.limit,.sort ...

		//pagination and limit
		const page=req.query.page||1;
		const limit=req.query.limit||10;
		const skip=(page-1)*limit;

		query=query.skip(skip).limit(limit);

		//sorting
		if(req.query.sort){
			//? what error to give if query is not in proper format
			//? also why this format only
			let sort=req.query.sort.replace(/,/g,' ');
			query=query.sort(sort);
		}else{
			query=query.sort('createdAt');
		}

		//projection
		if(req.query.fields){
			let fields=req.query.fields.replace(/,/g,' ');
			query =  query.select(fields);
		}else{
			query=query.select('-__v');
		}

		const events=await query;
		res.status(200).json({
			status: 'success',
			results: query.length,
			body: events,
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
//?if can't find that id what error to sent
exports.getEvent = async (req, res) => {
	try {
		const id = req.params.eventId;
		const event = await eventModel.findById(id);
		res.status(200).json({
			status: 'success',
			body: event,
		});
	} catch (e) {
		console.error(e);
		res.status(400).send(e.message);
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
		res.status(201).json({
			status: 'success',
			body: event,
		});
	} catch (e) {
		console.error(e);
		res.status(400).send(e.message);
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
	} catch (e) {
		console.error(e);
		res.status(400).send(e.message);
	}
};

//Tips:

//nested object searched through dot operator like .find({"venue.city"="delhi"});

//select
//"entryFee -_id" ✅
//"entryFee title"✅
//"-entryFee -title"✅
//"entryFee -title" ❌