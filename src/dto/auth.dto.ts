import { UserRole } from "src/db/entities/User";

export class RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  date_of_birth?: Date;
  role: UserRole;
}


export class LoginDto {
  email: string;
  password: string;
}

