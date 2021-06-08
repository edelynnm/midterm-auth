export type LoginSchema = {
  email: string,
  password: string
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface User {
  email: string,
  fname: string,
  lname: string,
  gender: Gender
}

export interface JWT_Properties extends User {
  exp: number,
  iat: number
}

export interface SignUpType extends User {
  password: string
}

export interface AuthResult {
  success: boolean,
  msg: string
}

export interface LoginError extends AuthResult  {
  token: null,
  failedAttempts: number,
  timeLocked: Date,
  remainingTime: {
    minutes: number,
    seconds: number
  }
}
export interface LoginSuccess extends AuthResult {
  token: string 
}

export interface SignUpResult extends AuthResult {
  token: string | null
}