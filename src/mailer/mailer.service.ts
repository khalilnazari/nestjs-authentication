import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailData } from './dto/mailer.dto';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) {}

  private async handleSend(data: EmailData) {
    const mailerConfig = this.configService.get('mailer');
    try {
      const transporter = nodemailer.createTransport({
        host: mailerConfig.host,
        service: mailerConfig.service,
        auth: {
          user: mailerConfig.user,
          pass: mailerConfig.pass,
        },
      });

      await transporter.sendMail(data);
      return true;
    } catch (error) {
      Logger.error('Sending email failed', error);
    }
  }

  public async sendMail(emailData) {
    const { type, bodyData, recepientInfo } = emailData;
    const html = this.getEmailTemplate(type);

    const htmlToSend = this.prepareBody(html, bodyData);

    const data: EmailData = {
      from: 'system',
      to: recepientInfo.to,
      subject: recepientInfo.subject,
      text: '',
      html: htmlToSend,
    };
    Logger.log(
      `Sending email to ${recepientInfo.to} - ${recepientInfo.subject}`,
    );
    const result = await this.handleSend(data);
    if (result) {
      Logger.log(
        `Email has been sent to ${recepientInfo.to} - ${recepientInfo.subject}`,
      );
    }
  }

  private getEmailTemplate(emailTemplateStr: string) {
    try {
      const filePath = `mailTemplates/${emailTemplateStr}.html`;
      if (!fs.existsSync(filePath)) {
        Logger.error(`${filePath} does not exist`);
        return;
      }
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.log(error);
    }
  }

  private prepareBody(html, data) {
    const template = handlebars.compile(html);
    return template(data);
  }
}
