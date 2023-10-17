const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
				// using validator pkg for email validation
				return validator.isEmail(eml);
			},
			message: 'please enter a valid email'
		}
		// an alternate way
		// validate:[validator.isEmail,"please enter a valid email"]
	},
	photo: {
		type: String,
		default:'common-dp.jpeg'
	},
	password: {
		type: String,
		required: [true, 'please provide a password'],
		validate: {
			validator: function (value) {
			  // Password criteria validation
			  const minLength = 8;
			  const hasUppercase = /[A-Z]/.test(value);
			  const hasLowercase = /[a-z]/.test(value);
			  const hasNumber = /\d/.test(value);
			  const hasSpecialChar = /[!@#$%^&*]/.test(value);
	  
			  return (
				value.length >= minLength &&
				hasUppercase &&
				hasLowercase &&
				hasNumber &&
				hasSpecialChar
			  );
			},
			message: 'Password does not meet the criteria',
		  },
		select: false
	},
	confirmPassword: {
		type: String,
		required: [true, 'please confirm your password'],
		validate: {
			validator: function (cp) {
				return cp === this.password;
			},
			message: 'The password and confirm password do not match'
		}
	},
	gender: {
		// to define limited set of values ,use enum along with type
		type: String,
		enum: ['male', 'female', 'other'], // enum = array of values

		required: [true, 'please enter you gender [male|female|other]']
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'organiser'],
		default: 'user'
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetTokenExpiry: Date,

	eventsRegistered:[
		{
			type:mongoose.Schema.ObjectId,
			ref:"events"
		}
	],
	//? try to remove below for normal users
	eventsCreated:[
		{
			type:mongoose.Schema.ObjectId,
			ref:"events"
		}
	]

});

// document middleware
userSchema.pre('save', async function (next) {
	// this pre-save-middleware runs only for creation not for updation
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

// instance method
// will be available on every single doc of this schema
userSchema.methods.verifyPassword = async function (provided_password) {
	// if field is set to false
	// this object does'nt contain that field obviously
	// use .select('+password')
	return await bcrypt.compare(provided_password, this.password);
};

userSchema.methods.PasswordChangeAfterJwtIat = function (jwtIat) {
	if (this.passwordChangedAt) {
		const passwordChangedAt = this.passwordChangedAt.getTime() / 100;
		return passwordChangedAt < jwtIat;
	}
	return false;
};

// creating resetToken using crypto module
userSchema.methods.generateResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	// stored hashed resetToken in database
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.passwordResetTokenExpiry = Date.now() + 5 * 60 * 1000; //5min expiry

	return resetToken;
};

userSchema.pre('save', function (next) {
	// isModified=true if field has changed or newly created
	// isNew =true if doc is newly created
	if (this.isModified('password') && !this.isNew) {
		//- 2 sec so being safer side that passwChanged shouldn't be get > token
		this.passwordChangedAt = Date.now() - 2000;
	}
	next();
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
