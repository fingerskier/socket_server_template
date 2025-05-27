import jwt from 'jsonwebtoken'
import express from 'express'

const router = express.Router()

router.post('/login-otp', async (req, res) => {
  const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });
    try {
      const { rows } = await pool.query(
        `DELETE FROM login_otps
         WHERE user_id=(SELECT id FROM users WHERE email=$1)
           AND otp=$2 AND expires_at>now()
         RETURNING user_id`,
        [email, otp]
      )
      
      if (!rows.length) return res.status(400).json({ error: 'invalid otp' })

      await pool.query('UPDATE users SET verified=TRUE WHERE id=$1', [rows[0].user_id])

      const token = jwt.sign(
        { userId: rows[0].user_id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      )
      res.cookie('token', token, { httpOnly: true })
      res.json({ token })
    } catch (err) {
      console.error(err)
    res.status(400).json({ error: 'login failed' })
  }
})

export default router
