import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.ZOHO_MAIL,
    pass: process.env.ZOHO_PWD,
  },
});

export class Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export function createMail(mail): Mail {
  let ret = {
    from: process.env.ZOHO_MAIL,
    subject: 'E-mail verification',
    text: 'Cet E-mail est un E-mail automatique',
    to: '',
  };
  ret = { ...ret, ...mail };
  return ret;
}
