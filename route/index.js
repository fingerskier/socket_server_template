import email from './email.js'
import otp from './otp-login.js'
import express from 'express'

const router = express.Router()

router.use(email)
router.use(otp)


export default router