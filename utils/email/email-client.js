const nodemailer = require('nodemailer');

require("dotenv").config();

const { EMAIL_HOST,EMAIL_PORT,EMAIL_USER,EMAIL_PASS } = process.env;

const send = async (options) =>{
  if( EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS){
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false,
      auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
      },
      tls: {
          rejectUnauthorized: false
      }
    });
   await transporter.sendMail({...options});
  }
  return null;
};

module.exports= {
  send
}