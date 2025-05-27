-- SOME query editors don't support the $$ syntax, use pgAdmin or the console

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT FALSE,
  roles varchar default 'player'
);

CREATE OR REPLACE FUNCTION users_changed() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('users_changed', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$;


CREATE TRIGGER users_changed_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION users_changed();


CREATE TABLE IF NOT EXISTS login_otps (
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL DEFAULT (now() + interval '10 minutes')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_login_otps_user_id ON login_otps(user_id);