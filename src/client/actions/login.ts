import { LoginError, LoginSchema, LoginSuccess } from "../../shared/models";

export const login = async (body: LoginSchema): Promise<LoginSuccess|LoginError|null> => {
  try {
    const result = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const parsedResult = await result.json()
    return parsedResult
  } catch (error: any) {
    // console.error(error)
    return null
  }
}