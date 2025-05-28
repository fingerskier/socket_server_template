import jwt from 'jsonwebtoken'

/**
 * Express middleware that validates a JWT stored in a cookie.
 * Adds the decoded user to `req.user` when valid.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function checkJwtSession(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    req.user = decoded
    next()
  })
}
