import getQuery from './conx.js'

const query = getQuery()

/**
 * Retrieve all users ordered by id.
 * @returns {Promise<object[]>} list of users
 */
export async function list() {
  const { rows } = await query('SELECT * FROM users ORDER BY id')
  return rows
}

/**
 * Fetch a single user by id.
 * @param {number} id - user identifier
 * @returns {Promise<object>} user record
 */
export async function read(id) {
  const { rows } = await query('SELECT * FROM users WHERE id=$1', [id])
  return rows[0]
}

/**
 * Insert a new user.
 * @param {{email: string, verified?: boolean, roles?: string}} param0 user fields
 * @returns {Promise<object>} created user
 */
export async function create({ email, verified = false, roles = 'player' }) {
  const { rows } = await query(
    'INSERT INTO users (email, verified, roles) VALUES ($1,$2,$3) RETURNING *',
    [email, verified, roles]
  )
  return rows[0]
}

/**
 * Update a user with partial fields.
 * @param {number} id - user id
 * @param {object} fields - fields to update
 * @returns {Promise<object>} updated user
 */
export async function update(id, fields) {
  const keys = Object.keys(fields)
  if (!keys.length) return read(id)
  const sets = keys.map((k, i) => `${k}=$${i + 1}`).join(', ')
  const values = keys.map(k => fields[k])
  values.push(id)
  const { rows } = await query(
    `UPDATE users SET ${sets} WHERE id=$${keys.length + 1} RETURNING *`,
    values
  )
  return rows[0]
}

/**
 * Remove a user by id.
 * @param {number} id - user id
 * @returns {Promise<void>}
 */
export async function del(id) {
  await query('DELETE FROM users WHERE id=$1', [id])
}

export default {
  create,
  read,
  list,
  update,
  del,
}