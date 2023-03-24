const sgMail = require('@sendgrid/mail');
const pug = require('pug');
const {convert} = require('html-to-text');
const path = require('path');

// const dotenv = require('dotenv');
// dotenv.config({path:"../config.env"})

module.exports = class Email {
    constructor(user,url,message) {
        this.to = user.email;
        this.name = user.name;
        this.url = url;
        this.message=message;
    }
    async sendEmail(html, subject) {
        const msg = {
            to:this.to,
            from: { name: 'EventEase', email: process.env.SENDER_MAIL},
            subject,
            html,
            text:convert(html)
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        try {
            return await sgMail.send(msg);
        } catch (err) {
            console.error(err);
        }
    }
    sendPasswordReset(){
        const html = pug.renderFile(path.join(__dirname,'../Views/resetEmailTemplate.pug'),{
            name:this.name,
            url:this.url,
            message:this.message
        })
        return this.sendEmail(html,'Reset Your Password')
    }
}

// console.log(process.env.SENDER_MAIL);
// console.log(process.env.MAIL_TRAP_HOST);

