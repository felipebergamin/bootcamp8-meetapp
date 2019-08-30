import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, transport, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      transport,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
