import React, { useContext, createContext, useState, useEffect } from "react";
import { User, LoginSchema, LoginError, SignUpType, SignUpResult, JWT_Properties } from "../../shared/models";
import { setToken } from "./authActions";
import { login } from "./login";
import { signUp } from "./signup";
import jwtDecode from "jwt-decode";


const useProvideAuth = () => {
  const [user, setUser] = useState<JWT_Properties | null>(null);
  const [error, setError] = useState<LoginError | SignUpResult | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const persistUser = () => {
      const token: string | null = localStorage.getItem('token')
      let loggedInUser: JWT_Properties | null = null;
  
      if(token) {
        loggedInUser = jwtDecode(token)
      }
  
      setError(null)
      setUser(loggedInUser)
      setLoading(false)
    }

    persistUser()
  }, [])

  async function loginUser (body: LoginSchema) {
    try {
      const response = await login(body);

      if(response) {
        if(response.success && response.token) {
          const user: JWT_Properties = setToken(response.token)
          return setUser(user);
        } 

        if(response.token === null) {
          setUser(null)
          return setError(response);
        }
      }
    } catch (error) {
      console.error(error)
      return null
    }
  };

  async function signupUser (values: SignUpType) {
    try {
      const response = await signUp(values);

      if(response) {
        if(response.success && response.token) {
          const user: JWT_Properties = setToken(response.token)
          return setUser(user)
        } 

        if(response.token === null) {
          setUser(null)
          return setError(response);
        }
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async function logoutUser () {
    localStorage.removeItem("token");
    setUser(null)
  };

  return {
    user,
    loginUser,
    logoutUser,
    signupUser,
    error,
    loading
  };
}

type AuthData = {
  user: User | null,
  error: LoginError | SignUpResult | null,
  loading: boolean,
  loginUser: Function,
  logoutUser: Function,
  signupUser: Function
}

const initialData = { 
  user: null, 
  error: null, 
  loading: true,
  loginUser: () => {},
  logoutUser: () => {},
  signupUser: () => {}
}

const AuthContext = createContext<AuthData>(initialData);
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthContext, useProvideAuth, initialData }