export class CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
