const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(smtpTransport({
  host : "smtp.sendgrid.net",
  port: 587,
  auth : {
    user : "apikey",
    pass : "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"
  }
}));

export const mailService = {
  sendSelection(params: any): Promise<any>{
    const mailOptions = {
      from: 'yangabay@gmail.com',
      to: 'gabay.yaniv@gmail.com, yangabay@gmail.com, yaniv@yanga.co.il',
      subject: params.sender + ' selection for ' + params.folder,
      text: params.selection
    };

    return new Promise((resolve, reject) => {
      try {
        return transporter.sendMail(mailOptions, (error: any, res: any) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(res);
            console.log('Email sent: ' + res.response);
          }
        });
      } catch (error: any) {
        console.log('ERROR', error);
      }
    });
  },
};
