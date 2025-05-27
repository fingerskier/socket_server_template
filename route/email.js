import crypto from 'crypto'
import express from 'express'
import nodemailer from 'nodemailer'
import getQuery from '../db/conx.js'

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


router.post('/verify-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const { rows } = await getQuery(
      'INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email RETURNING id',
      [email]
    );
    const user = rows[0];
    const token = crypto.randomBytes(16).toString('hex');
    await getQuery(
      "INSERT INTO email_verifications (user_id, token) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET token=$2, expires_at=now()+interval '1 day'",
      [user.id, token]
    );
    const verifyUrl = `${req.protocol}://${req.get('host')}/verify?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      text: `Click to verify: ${verifyUrl}`,
  })
  res.json({ status: 'ok' })
})


router.get('/verify', async (req, res) => {
  const { token } = req.query
  const { rows } = await getQuery(
    'DELETE FROM email_verifications WHERE token=$1 AND expires_at>now() RETURNING user_id',
    [token]
  );
  if (!rows.length) return res.status(400).send('Invalid token');
  await getQuery('UPDATE users SET verified=TRUE WHERE id=$1', [rows[0].user_id]);
  res.send('Email verified. You may close this window.')
})


router.post('/send-otp', async (req, res) => {
  const { email } = req.body

    if (!email) return res.status(400).json({ error: 'email required' })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid email' })
    }

    let { rows } = await getQuery('SELECT id FROM users WHERE email=$1', [email])

    if (!rows.length) {
      rows = (
        await getQuery('INSERT INTO users (email) VALUES ($1) RETURNING id', [email])
      ).rows
    }

    const user = rows[0]
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await getQuery(
      "INSERT INTO login_otps (user_id, otp, expires_at) VALUES ($1,$2,now()+interval '10 minutes') ON CONFLICT (user_id) DO UPDATE SET otp=$2, expires_at=now()+interval '10 minutes'",
      [user.id, otp]
    )
    await transporter.sendMail({
      to: email,
      subject: 'Your login code',
      text: `Your login code is ${otp}`,
  })
  res.json({ status: 'ok' })
})


export default router