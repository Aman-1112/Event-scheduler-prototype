const userModel = require('../Models/userModel');
//image processing tool
const sharp = require('sharp');
const multer = require('multer');
//it's a middleware use to handle multi-part form data
//i.e. for uploading files
const CustomError = require('../utils/errorHandler');

// const multerStorage = multer.diskStorage({
// 	destination:(req,file,cb)=>{
// 		cb(null,'public/image/users')
// 	},
// 	filename:(req,file,cb)=>{
// 		const ext=file.mimetype.split('/')[1];
// 		cb(null,`user-${Date.now()}.${ext}`)
// 	}
// })

//stores in memory instead of disk 
//so to be used by sharp
const multerStorage = multer.memoryStorage();


//only allows image file only
const multerFilter = (req,file,cb)=>{
	if(file.mimetype.startsWith('image'))
		cb(null,true)
	else
		cb(new CustomError('Uploaded file is not an image ..please upload image only',400))
}

const upload = multer({
	storage:multerStorage,
	fileFilter:multerFilter
})

//make photo accessible in req.file
exports.handleUploadedPhoto = upload.single('photo');

exports.resizeUploadedPhoto = (req,res,next)=>{
	if(!req.file) return next();

	//processing image as buffer from memory
	// and then storing to the disk
	req.file.filename = `user-${Date.now()}.jpeg`;
	sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/image/users/${req.file.filename}`)
	next();
}

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
