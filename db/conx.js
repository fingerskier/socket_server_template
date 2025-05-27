import { Pool } from 'pg'
import { EventEmitter } from 'events'
import format from 'pg-format'

let pool

/**
 * @description singleton Pool
 * @returns {Pool}
 */
function getPool() {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return pool
}


/**
 * @description Shorthand query helper – same signature as pg.query().
 * @param {string} text
 * @param {any[]} params
 * @returns {Promise<QueryResult>}
 */
export default function getQuery() {
  return (sql, params) => getPool().query(sql, params)
}

/**
 * @description Listen to a Postgres channel and re‑emit NOTIFY payloads.
 * @param {string} channel
 * @returns {EventEmitter} ~ events: event, error, connect, reconnect, close; .close() to stop listening
 */
export async function listen(channel) {
  console.log('Setting up PG event-listener', channel)
  try {
    const ear = new EventEmitter()
    const pool = await getPool()

    const attach = async () => {
      const client = await pool.connect()

      client.on('error', err => {
        ear.emit('error', err)
        setTimeout(() => {
          ear.emit('reconnect')
          attach().catch(e => ear.emit('error', e))
        }, 1000)
      })

      // Quote the channel identifier to avoid SQL‑injection issues
      await client.query(format('LISTEN %I', channel))
      ear.emit('connect', channel)

      client.on('notification', msg => {
        try {
          ear.emit('event', JSON.parse(msg.payload))
        } catch (e) {
          ear.emit('error', e)
        }
      })

      ear.close = async () => {
        client.removeAllListeners()
        client.release()
        ear.emit('close')
      }
    }

    await attach()
    return ear
  } catch (error) {
    throw error
  }
}

/* --------------------------------------------------------------------
   NOTIFY trigger example:

   CREATE OR REPLACE FUNCTION users_changed() RETURNS trigger AS $$
   BEGIN
     PERFORM pg_notify('users_changed', row_to_json(NEW)::text)
     RETURN NEW
   END
   $$ LANGUAGE plpgsql

   CREATE TRIGGER users_changed_trigger
     AFTER INSERT OR UPDATE OR DELETE ON users
     FOR EACH ROW EXECUTE FUNCTION users_changed()
*/
