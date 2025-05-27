import otp from './otp.js'
import express from 'express'

const router = express.Router()

router.use('/otp', otp)


export default router