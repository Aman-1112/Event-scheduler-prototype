//extending Error class 
class CustomError extends Error {
	constructor(errorMessage, statusCode) {
		super(errorMessage);
        console.log(this);
		this.statusCode = statusCode || 500;
		// Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = CustomError;
