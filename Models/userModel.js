const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, 'please provide your name']
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: [true, 'please provide your email'],
		validate: {
			validator: function (eml) {
				//using validator pkg for email validation
				return validator.isEmail(eml);
			},
			message: 'please enter a valid email'
		}
		// an alternate way
		// validate:[validator.isEmail,"please enter a valid email"]
	},
	password: {
		type: String,
		required: [true, 'please provide a password'],
		minlength: 6,
		select: false
	},
	confirmPassword: {
		type: String,
		required: [true, 'please confirm your password'],
		minlength: 6,
		validate: {
			validator: function (cp) {
				return cp === this.password;
			},
			message: 'your confirm password was wrong'
		}
	},
	gender: {
		// to define limited set of values ,use enum along with type
		type: String,
		enum: ['male', 'female', 'other'], // enum = array of values

		required: [true, 'please enter you gender [male|female|other]']
	},
	passwordChangedAt: Date
	//? problem in joining two collections
	//? eventsRegistered: {
	//? 	type: Object
	//? }
});

//document middleware
userSchema.pre('save', async function (next) {
	//this pre-save-middleware runs only for creation not for updation
	// doc.isModified is method on doc tells if it is newly saved / updated
	if (this.isModified('password')) {
		// if it is then use bcrypt to encrypt
		// here 12 is workfactor which means 2^12 rounds were done to encrypt
		this.password = await bcrypt.hash(this.password, 12);

		//? where is work factor or if it is why we are using work factor for creating salt
		//? const salt = await bcrypt.genSalt(12);
		//? console.log("salt is",salt)
		//? this.password= await bcrypt.hash(this.password,salt);

		// remember:below will make field disappear for doc from db
		this.confirmPassword = undefined;
	}
	next();
});

//instance method
// will be available on every single doc of this schema
userSchema.methods.verifyPassword = async function (provided_password) {
	//if field is set to false
	//this object does'nt contain that field obviously
	return await bcrypt.compare(provided_password, this.password);
};

userSchema.methods.PasswordChangeAfterJwtIat = function (jwtIat) {
	if (this.passwordChangedAt) {
		const passwordChangedAt = this.passwordChangedAt.getTime() / 100;
		return passwordChangedAt > jwtIat;
	}
	return false;
};

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
