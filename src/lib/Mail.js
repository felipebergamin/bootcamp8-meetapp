import nodemailer from 'nodemailer';
import { resolve } from 'path';
import nodemailerhbs from 'nodemailer-express-handlebars';
import expresshbs from 'express-handlebars';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configTemplates();
  }

  sendMail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }

  configTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: expresshbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
}

export default new Mail();
