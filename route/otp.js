import express from 'express'
import nodemailer from 'nodemailer'
import getQuery from '../db/conx.js'
import jwt from 'jsonwebtoken'

const query = getQuery()
const router = express.Router()

const mailerCallback = (error,info)=>{
  if (error) console.error(error)
  console.log(info)
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}, mailerCallback)


router.post('/send', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) return res.status(400).json({ error: 'email required' })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid email' })
    }

    let {rows} = await query('SELECT id FROM users WHERE email=$1', [email])
    console.log('ROWS', rows)

    if (!rows?.length) {
      rows = (
        await query('INSERT INTO users (email) VALUES ($1) RETURNING id', [email])
      ).rows
    }

    console.log('ROWS', rows)

    const user = rows[0]
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    await query(
      "INSERT INTO login_otps (user_id, otp, expires_at) VALUES ($1,$2,now()+interval '10 minutes') ON CONFLICT (user_id) DO UPDATE SET otp=$2, expires_at=now()+interval '10 minutes'",
      [user.id, otp]
    )
    
    await transporter.sendMail({
      to: email,
      subject: 'Your login code',
      text: `Your login code is ${otp}`,
    })
    res.json({ status: 'ok' })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'send failed' })
  }
})


router.post('/login', async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });
  try {
      console.log('LOGIN', req.body)
      const { rows } = await query(
        `DELETE FROM login_otps
         WHERE user_id=(SELECT id FROM users WHERE email=$1)
           AND otp=$2 AND expires_at>now()
         RETURNING user_id`,
        [email, otp]
      )
      
      if (!rows.length) return res.status(400).json({ error: 'invalid otp' })

      console.log('ROWS', rows)
      await query('UPDATE users SET verified=TRUE WHERE id=$1', [rows[0].user_id])

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