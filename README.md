# socket_server_template
Socket.io + Express configurable

## Whatsit?

This a template server + UI utilizing socket.io + express.
Requires a `.env` with the following:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/postgres
SMTP_HOST=my.smtp.server
SMTP_USER=email@example.com 
SMTP_PASS=password
JWT_SECRET=supersecret
```

## Structure

REST API routes are in `/route`
Socket.io RPC handlers are in `/io/rpc.js`
Socket.io event-handlers are in `/io/eventor.js`
* When you setup Postgres notifications, you can listen for these
using `on`
Examples of how to setup Postgres notifications are in `/db/schema.sql`
User login is handled via email OTP;  if you're on localhost you need a compatible service (or just trigger it and look in the db for testing.)


## Running

Do `npm i` in the root and in `client_dev`.
