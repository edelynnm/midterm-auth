import { convertToTimestamp } from "../helpers/converters"

export const getRemainingTime = (lockDurationMins: number, timeLocked: Date, current: Date) => {
  const timeLockedMS = convertToTimestamp(timeLocked)
  const currentMS = convertToTimestamp(current)
  const lockDurationInMS = lockDurationMins * 60000
  const remainingMinutes = (lockDurationInMS - (currentMS - timeLockedMS)) / 60000
  const minutes = Math.trunc(remainingMinutes)
  const seconds = Math.round((remainingMinutes - minutes) * 60)
  return { minutes, seconds }
}

export const errorResponse = (failedAttempts: number, timeLocked: Date | null, current: Date, lockDurationMins: number) => {
  let lockedMsg;
 
  if(failedAttempts >= 3 && timeLocked) {
    let { minutes, seconds } = getRemainingTime(lockDurationMins, timeLocked, current)
  
    lockedMsg =  {    
      msg: `Temporarily locked due to too many failed login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds > 1 ? `s` : ''}` : ''}.`,
      timeLocked: convertToTimestamp(timeLocked),
      remainingTime: {
        minutes,
        seconds
      }
    }
  } else {
    lockedMsg = { msg: 'Invalid credentials' }
  }

  return ({
    success:false, 
    token: null,
    failedAttempts: failedAttempts,
    ...lockedMsg
  })
}
