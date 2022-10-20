const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	title: {
		type: String,

		//schema type options
		lowercase: true,
		unique: [true, 'each event title must be unique'],
		required: [true, 'an event must have some title']
		//
	},
	iconUrl: {
		type: String,
		default: 'shorturl.at/CDNV2',
	},
	description: {
		type: String,
		lowercase: true,
		required: [true, 'an event must have some description']
	},
	venue: {
		street:{
			type: String,
			lowercase: true,
			required: [true, 'an event must have precise street']
		},
		city:{
			type: String,
			lowercase: true,
			required: [true, 'an event must have precise city']
		},
		state:{
			type: String,
			lowercase: true,
			required: [true, 'an event must have precise state']
		}
	},
	//? how to compare dates in mongoose 
	//? could not get this in case of findbyIdandUpdate
	start: {
		type: Date,
		validate: {
			validator: function () {
				console.log(this._update)
				console.log("this=",this);
				console.log("this.start"+this.start);
				console.log("date.now"+Date.now());
				return this.start > Date.now();
			},
			message: 'an event cannot start in the past',
		},
		required: [true, 'an event must have a start date']
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
		required: [true, 'an event must have a end date']
	},
	//? time
	entryFee:{
		type:Number,
		default:0
	},
	maxGuestLimit: {
		type: Number,
		default: 100,
	},
	//?seats remaining
	admin: {
		type: String,
		required: [true, 'please provide the admin name']
	}
},{timestamps:true});
//set schema option timestamp:true makes mongoose automatically add two fields
//createdAt and updatedAt which will be filled and updated automaticallyl

const eventModel = mongoose.model('events', eventSchema);
module.exports = eventModel;
