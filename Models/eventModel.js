const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	title: {
		type: String,

		//schema type options
		lowercase: true,
		unique: true,
		required: [true, 'an event must have some title'],
		//
	},
	iconUrl: {
		type: String,
		default: 'shorturl.at/CDNV2',
	},
	description: {
		type: String,
		lowercase: true,
		required: [true, 'an event must have some description'],
	},
	venue: {
		type: String,
		lowercase: true,
		required: [true, 'an event must have some description'],
	},
	start: {
		type: Date,
		validate: {
			validator: function () {
				return this.start > Date.now();
			},
			message: 'an event cannot start in the past',
		},
		required: [true, 'an event must have a start date'],
	},
	end: {
		type: Date,
		//for multiple validator pass array of objs containing validator and message
		validate: [
			{
				validator: function () {
					return this.end > Date.now();
				},
				message: 'an event cannot end in the past',
			},
			{
				validator: function () {
					return this.start < this.end;
				},
				message: 'an event cannot end before it starts',
			},
		],
		required: [true, 'an event must have a end date'],
	},
	//? time
	maxGuestLimit: {
		type: Number,
		default: 100,
	},
	admin: {
		type: String,
		required: [true, 'please provide the admin name'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	//? updatedAt:Date
});

const eventModel = mongoose.model('events', eventSchema);
module.exports = eventModel;
