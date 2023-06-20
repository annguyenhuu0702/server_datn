export interface register extends login {
  fullname: string;
}

export interface login {
  email: string;
  password: string;
}

export interface fogotPassword {
  email: string;
}

export interface resetPassword {
  password: string;
}

export interface typeAuth {
  user: any;
  accessToken: string;
}

export interface changeProfile {
  fullname: string;
  birthday: Date;
  gender: boolean;
  phone?: string;
  email?: string;
  city?: string;
  district?: string;
  ward?: string;
  address?: string;
  avatar?: string;
}

export interface changePassword {
  currentpassword: string;
  newpassword: string;
}

export interface changeEmail {
  email: string;
}
