export class CreateMailerDto {}

export class EmailData {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export enum EmailSubject {
  forgetPassword = 'Forget Password email',
}

export enum EmailType {
  forgetPassword = 'forget-password',
}
