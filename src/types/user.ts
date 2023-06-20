import { queryItems } from "../common/type";

export interface createUser extends updateUser {
  password: string;
}

export interface updateUser {
  email: string;
  avatar: string;
  fullname: string;
  phone: string;
  gender: boolean;
}

export interface updateSuggestion {
  suggestion: number[];
}

export interface getAllUser extends queryItems {
  email?: string;
  fullname?: string;
  phone?: string;
}
