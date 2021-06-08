import jwtDecode from "jwt-decode";
import { JWT_Properties } from '../../shared/models';

export const setToken = (token: string): JWT_Properties => {
  localStorage.setItem('token', token)
  const user: JWT_Properties = jwtDecode(token)
  return user;
};
