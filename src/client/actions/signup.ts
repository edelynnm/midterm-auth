import { SignUpResult, SignUpType } from "../../shared/models";

export const signUp = async (body: SignUpType): Promise<SignUpResult|null> => {
  try {
    const result = await fetch('http://localhost:8080/api/auth/signUp', {
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