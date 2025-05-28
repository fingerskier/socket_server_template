import otp from './otp.js'
import express from 'express'

const router = express.Router()

/**
 * Mount sub-routes for the REST API.
 */
router.use('/otp', otp)

export default router
