const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()

const sendEmailCreateOrder = async () => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
        });


    let info = await transporter.sendMail({
            from: 'nhathuocthongminh@gmail.com', // sender address
            to: "thanhkg5@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });
    }
module.exports = {
    sendEmailCreateOrder
}