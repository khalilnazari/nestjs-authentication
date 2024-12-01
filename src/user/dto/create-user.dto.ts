export class CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class ForgetPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  newPassword: string;
  token: string;
}
