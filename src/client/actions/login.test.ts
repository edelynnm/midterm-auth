import { errorResponse } from '../../shared/actions/getTime';
import { convertToTimestamp } from '../../shared/helpers/converters';
import { login } from './login'

beforeEach(() => {
  fetchMock.resetMocks()
  jest.useFakeTimers('modern')
})

const validToken = 'someValidToken'
const lockDurationMins = 10

const validLogin = {
  email: 'valid_user@gmail.com',
  password: 'Str0ngP@ss!'
}

const anotherValidLogin = {
  email: 'another_valid@gmail.com',
  password: 'Str0ngP@ss!'
}

const invalidLogin = {
  email: 'invalid_user@gmail.com',
  password: 'Str0ngP@ss!'
}

describe('user login', () => {
  it('returns correct response on successful login with no previous failed attempts', async () => {
    fetchMock.once(JSON.stringify({ success: true, token: validToken, msg: 'Successfully logged in' }))

    const user = await login(validLogin)
    expect(user).toEqual({ success: true, token: validToken, msg: 'Successfully logged in' })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/login', {
      method: "POST",
      body: JSON.stringify(validLogin),
      headers: { "Content-Type": "application/json" }
    })
  })

  it('fails to login user due to server error', async () => {
    fetchMock.mockReject(new Error('Cannot connect to Postgres'))
    const user = await login(validLogin)
    expect(user).toEqual(null)
  })

  it('returns correct response on 1 failed login', async () => {
    jest.setSystemTime(new Date('2021-04-13T01:25:00'))

    const timeLocked = null
    let current = new Date()
    fetchMock.once(JSON.stringify(errorResponse(1, timeLocked, current, lockDurationMins)))

    const user = await login(invalidLogin)
    expect(user).toEqual({ 
      success: false, 
      token: null,
      msg: 'Invalid credentials', 
      failedAttempts: 1
    })
  })

  it('returns correct response on 3 or more failed login', async () => {
    jest.setSystemTime(new Date('2021-04-13T01:25:00'))

    const timeLocked = new Date()
    let current = new Date()

    fetchMock.once(JSON.stringify(errorResponse(3, timeLocked, current, lockDurationMins)))

    let user = await login(invalidLogin)

    expect(user).toEqual({
      success: false, 
      token: null,
      failedAttempts: 3,
      timeLocked: convertToTimestamp(timeLocked),
      msg: 'Temporarily locked due to too many failed login attempts. Please try again in 10 minutes.',
      remainingTime: { minutes: 10, seconds: 0 }
    })

    jest.advanceTimersByTime(153000) // Date.now() + 2 mins 33 seconds

    current = new Date()
    fetchMock.once(JSON.stringify(errorResponse(4, timeLocked, current, lockDurationMins)))

    user = await login(invalidLogin)

    expect(user).toEqual({
      success: false, 
      token: null,
      failedAttempts: 4,
      timeLocked: convertToTimestamp(timeLocked),
      msg: 'Temporarily locked due to too many failed login attempts. Please try again in 7 minutes and 27 seconds.',
      remainingTime: { minutes: 7, seconds: 27 }
    })

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('returns correct response on 3 or more failed attempts and logins successfully after more than remaining time', async () => {
    jest.setSystemTime(new Date('2021-04-13T01:25:00'))

    const timeLocked = new Date()
    let current = new Date()

    fetchMock.once(JSON.stringify(errorResponse(3, timeLocked, current, lockDurationMins)))

    let user = await login(invalidLogin)

    expect(user).toEqual({
      success: false, 
      token: null,
      failedAttempts: 3,
      timeLocked: convertToTimestamp(timeLocked),
      msg: 'Temporarily locked due to too many failed login attempts. Please try again in 10 minutes.',
      remainingTime: { minutes: 10, seconds: 0 }
    })

    jest.advanceTimersByTime(900000) // Date.now() + 15 minutes

    fetchMock.once(JSON.stringify({ success: true, token: validToken, msg: 'Successfully logged in' }))

    user = await login(validLogin)
    expect(user).toEqual({ success: true, token: validToken, msg: 'Successfully logged in' })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('returns correct response on 3 or more failed attempts and FAILED AGAIN after more than remaining time', async () => {
    let timeLocked = new Date('2021-04-13T01:25:00')
    jest.setSystemTime(new Date('2021-04-13T01:27:30'))
    let current = new Date()

    fetchMock.once(JSON.stringify(errorResponse(5, timeLocked, current, lockDurationMins)))

    let user = await login(invalidLogin)

    expect(user).toEqual({
      success: false, 
      token: null,
      failedAttempts: 5,
      timeLocked: convertToTimestamp(timeLocked),
      msg: 'Temporarily locked due to too many failed login attempts. Please try again in 7 minutes and 30 seconds.',
      remainingTime: { minutes: 7, seconds: 30 }
    })

    jest.advanceTimersByTime(900000) // Date.now() + 15 minutes

    timeLocked = new Date()
    current = new Date()
    fetchMock.once(JSON.stringify(errorResponse(6, timeLocked, current, lockDurationMins)))

    user = await login(invalidLogin)
    expect(user).toEqual({
      success: false, 
      token: null,
      failedAttempts: 6,
      timeLocked: convertToTimestamp(timeLocked),
      msg: 'Temporarily locked due to too many failed login attempts. Please try again in 10 minutes.',
      remainingTime: { minutes: 10, seconds: 0 }
    })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('returns correct response on 3 or more failed attempts and LOGIN with different account', async () => {
    let timeLocked = new Date('2021-04-13T01:25:00')
    jest.setSystemTime(new Date('2021-04-13T01:27:30'))
    let current = new Date()

    fetchMock.once(JSON.stringify(errorResponse(5, timeLocked, current, lockDurationMins)))

    let user = await login(invalidLogin)

    expect(user).toEqual({
      success: false, 
      token: null,
      failedAttempts: 5,
      timeLocked: convertToTimestamp(timeLocked),
      msg: 'Temporarily locked due to too many failed login attempts. Please try again in 7 minutes and 30 seconds.',
      remainingTime: { minutes: 7, seconds: 30 }
    })

    jest.advanceTimersByTime(300000) // Date.now() + 5 minutes

    current = new Date()
    fetchMock.once(JSON.stringify({ success: true, token: validToken, msg: 'Successfully logged in' }))

    user = await login(anotherValidLogin)
    expect(user).toEqual({ success: true, token: validToken, msg: 'Successfully logged in' })
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})