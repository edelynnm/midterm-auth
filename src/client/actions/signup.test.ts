import { Gender } from '../../shared/models';
import {signUp} from './signup';

beforeEach(() => {
  fetchMock.resetMocks()
})

const validToken = 'someValidToken'

const newUser = {
  email: 'uniqueUser@test.com',
  password: 'UniqueUser123!',
  fname: 'Unique',
  lname: 'User',
  gender: Gender.MALE
}

const existingEmailUser = {
  email: 'tforri0@google.com',
  password: 'adtvsycBl12!',
  fname: 'Existing',
  lname: 'User',
  gender: Gender.MALE
}

describe('user sign up', () => {
  it('signs up user with unique email', async () => {
    fetchMock.once(JSON.stringify({ success: true, token: validToken, msg: 'Successfully logged in' }))

    const user = await signUp(newUser)
    expect(user).toEqual({ success: true, token: validToken, msg: 'Successfully logged in' })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/signUp', {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" }
    })
  })

  it('signs up user with existing email', async () => {
    fetchMock.once(JSON.stringify({ success: false, token: null, msg: 'Email already exists.' }))

    const user = await signUp(existingEmailUser)
    expect(user).toEqual({ success: false, token: null, msg: 'Email already exists.' })
  })

  it('fails to login user due to server error', async () => {
    fetchMock.mockReject(new Error('Cannot connect to Postgres'))
    const user = await signUp(newUser)
    expect(user).toEqual(null)
  })

  
})