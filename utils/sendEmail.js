// const nodemailer = require('nodemailer');

// const sendingMail = async ({ receiver, subject, text }) => {
// 	const transport = nodemailer.createTransport({
// 		host: process.env.MAIL_TRAP_HOST,
// 		port: process.env.MAIL_TRAP_PORT,
// 		auth: {
// 			user: process.env.MAIL_TRAP_USER,
// 			pass: process.env.MAIL_TRAP_PASS
// 		}
// 	});

// 	const mailOptions = {
// 		from: 'amanmbi0@gmail.com',
// 		to: receiver,
// 		subject,
// 		text
// 	};
// 	await transport.sendMail(mailOptions);
// };
// module.exports = sendingMail;

//To use gmail for sending email
//1.sender email must have 2-step authentication activated
//2.create password for app at https://myaccount.google.com/u/1/security

// const transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	auth: {
// 		user: "amanmbi0@gmail.com",
// 		pass: "rdyuiwmyubzxqdxk"
// 	}
// });
