import { Router } from "express";
import db from './db';
import { errorResponse, getRemainingTime } from '../../shared/actions/getTime';
import { v4 as uuidv1 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();

const router = Router();
const saltRounds = 12;
const jwtSecret = process.env.JWT_SECRET_KEY;
const lockDurationMins = 10

const createToken = (payload: any) => {
  if(jwtSecret) {
    const token = jwt.sign(payload, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "30m"
    });

    return token
  }
  
  throw new Error('No JWT_SECRET_KEY found!')
}

const handleFailedAttempt = async (email: string) => {
  let timeLocked: Date | null = null; // timestamp
  let attempts: number;
  let current: Date = new Date()

  const failedUser = await db('failed_attempts').select().where({ email: email })
  
  if (failedUser.length === 0) { // new fail, no time locked
    attempts = 1;
    await db('failed_attempts').insert({ id: uuidv1(), email: email, attempts })
  } else {
    attempts = failedUser[0].attempts += 1
    let update: {attempts: number, used_on?: Date } = { attempts } // USED_ON = TIMESTAMP

    if(attempts === 3) {
      update = {attempts, used_on: current}
    }
    
    const [addFailedUser] = await db('failed_attempts').update(update).where({ id: failedUser[0].id }).returning('*')
    
    if(addFailedUser.used_on) {
      timeLocked = addFailedUser.used_on
      const { minutes, seconds } = getRemainingTime(lockDurationMins, addFailedUser.used_on, new Date())
      
      // acc unlocked but failed again
      if(minutes <= 0 && seconds <= 0) {
        timeLocked = current
        await db('failed_attempts').update({ used_on: current }).where({ id: failedUser[0].id }) // update time locked
      }
    }
  }

  return errorResponse(attempts, timeLocked, current, lockDurationMins)
}


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db('users').select().where({ email })

    // Email does not exists
    if (user.length === 0) { 
      const failedAttempt = await handleFailedAttempt(email)
      return res.json(failedAttempt)
    }

    // Wrong password
    const validPswd = await bcrypt.compare(password, user[0].password)

    if(!validPswd) {
      const failedAttempt = await handleFailedAttempt(email)
      return res.json(failedAttempt)
    }

    // remove from failed attempts
    const failedUser = await db('failed_attempts').select().where({ email: email })

    if(failedUser.length === 1) {
      const { minutes, seconds } = getRemainingTime(lockDurationMins, failedUser[0].used_on, new Date())

      if(minutes > 0 && seconds > 0) {
        const failedAttempt = await handleFailedAttempt(email)
        return res.json(failedAttempt)
      }

      await db('failed_attempts').update('attempts', 0).where({ email: email }) 
    }

    //create token
    delete user[0].password
    const token = createToken(user[0])
    return res.json({ success: true, token, msg: 'Successfully logged in' })
    
  } catch (error: any) {
    throw new Error(error)
  }
})

router.post('/signUp', async (req, res) => {
  try {
    const { email, password, gender, fname, lname } = req.body;
    const user = await db('users').select().where({ email })

    if(user.length > 0) {
      return res.json({ success: false, token: null, msg: 'Email already exists.'})
    }

    const cryptedPassword = bcrypt.hashSync(password, saltRounds)
    const newUser = await db('users').insert({id: uuidv1(), email, password: cryptedPassword, gender, fname, lname}).returning('*')
    
    delete newUser[0].password
    const token = createToken(newUser[0])

    return res.json({success: true, token, msg: 'Successfully signed up!'})
  } catch (error: any) {
    throw new Error(error)
  }
})

export default router;