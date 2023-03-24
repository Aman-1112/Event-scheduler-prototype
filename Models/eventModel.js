const mongoose = require('mongoose');

//?min length max length
const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,

			//schema type options
			trim: true,
			lowercase: true,
			unique: true,
			required: [true, 'an event must have some title'],
			//
		},
		photo: {
			type: String,
			default: 'event.jpg',
		},
		description: {
			type: String,
			lowercase: true,
			required: [true, 'an event must have some description'],
		},
		venue: {
			street: {
				type: String,
				lowercase: true,
				required: [true, 'an event must have precise street'],
			},
			city: {
				type: String,
				lowercase: true,
				required: [true, 'an event must have precise city'],
			},
			state: {
				type: String,
				lowercase: true,
				required: [true, 'an event must have precise state'],
			},
		},
		//?date part is all wrong
		start: {
			type: Date,
			validate: {
				validator: function () {
					//? how to compare dates in mongoose
					//? could not get this in case of findbyIdandUpdate
					console.log(this._update);
					console.log('this=', this);
					console.log('this.start' + this.start);
					console.log('date.now' + Date.now());
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
		entryFee: {
			type: Number,
			default: 0,
		},
		maxGuestLimit: {
			type: Number,
			default: 100,
		},
		organiser: {
			type: mongoose.Schema.ObjectId,
			ref:'users',
			required: [true, 'please provide the organiser Id'],
		},
		usersRegistered:[
			{
				type:mongoose.Schema.ObjectId,
				ref:'userModel'
			}
		]
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// set schema option timestamp:true makes mongoose automatically add two fields
// createdAt and updatedAt which will be filled and updated automatically
// toJson & toObject set virtual property to be true while sending Json or Object

// virtual property
eventSchema.virtual('days-left').get(function(){
	//.get means it will set virtual prop. for every get request
	const date1=new Date(this.start);
	const date2=new Date();
	return (date1-date2)/(1000*60*60*24);
})


//mongoose middlware or pre-post hooks

// 1.document middleware
// it runs before or after the document is saved

//pre-save middleware runs only when doc is saved or created
//? how does it is showing virtual properties
eventSchema.pre('save',function(next){
	console.log("pre-save-middleware-1");
	console.log(this);
	next();
})

eventSchema.pre('save',function(next){
	console.log("pre-save-middleware-2")
	next();
})

eventSchema.post('save',function(doc,next){
	console.log("post-save-middleware-1");
	console.log(doc);
	next();
})

eventSchema.post('save',function(doc,next){
	console.log("post-save-middleware-2");
	next();
})

// 2.query middleware
// it runs before or after the query is executed (i.e await ...)

eventSchema.pre(/^find/,function(next){// runs for all method starting with find
	// here this represents the query object
	// so query chaining can be done
	// something like this.find({entryFee:{$gte:100}}) 
	next();
})
//similarily post method

// 3.aggregate middleware
eventSchema.pre('aggregate',function(next){
	console.log("pre-aggregate-middleware");
	next();
})
//similarily post method

const eventModel = mongoose.model('events', eventSchema);
module.exports = eventModel;
