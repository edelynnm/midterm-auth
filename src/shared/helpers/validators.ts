import * as yup from 'yup';

const passwordStrongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
const passwordErrMsg = 'Password must contain an uppercase, a lowercase, a number, a symbol and must not be less than 8 characters.';

export const loginSchema = yup.object({
  email: yup.string().label('Email').email().required(),
  password: yup.string().label('Password').required()
})

export const signUpSchema = yup.object().shape({
  email: yup.string().label('Email').email().required(),
  password: yup.string().label('Password').matches(passwordStrongPattern,passwordErrMsg).required(),
  fname: yup.string().label('First name').required(),
  lname: yup.string().label('Last name').required(),
  gender: yup.string().label('Gender').required()
});