import { UserRole } from './role.enum';

export interface User {
  UserId: string;
  Email: string;
  FullName: string;
  PhoneNumber: string;
  UserRole: UserRole;
  NewsCount: number;
}

export interface LoginResponse {
  Success: boolean;
  Message: string;
  AccessToken: string;
  IdToken: string;
  User: User;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}
