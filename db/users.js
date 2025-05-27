import getQuery from './conx.js'

const query = getQuery()


export async function list() {
  const { rows } = await query('SELECT * FROM users ORDER BY id')
  return rows
}

export async function read(id) {
  const { rows } = await query('SELECT * FROM users WHERE id=$1', [id])
  return rows[0]
}

export async function create({ email, verified = false, roles = 'player' }) {
  const { rows } = await query(
    'INSERT INTO users (email, verified, roles) VALUES ($1,$2,$3) RETURNING *',
    [email, verified, roles]
  )
  return rows[0]
}

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