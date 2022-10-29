const userModel = require('../Models/userModel');

exports.getAllUsers = async (req, res) => {
	try {
		const users = await userModel.find();

		res.status(200).json({
			status: 'success',
			data: {
				users
			}
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
};
