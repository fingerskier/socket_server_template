# socket_server_template

A lightweight template that pairs **Express** with **Socket.IO** and a Postgres
backend. It also includes a small development client.

## Getting Started

Create a `.env` file with the following values:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/postgres
SMTP_HOST=my.smtp.server
SMTP_USER=email@example.com
SMTP_PASS=password
JWT_SECRET=supersecret
```

## Project Layout

- REST API routes live in `route/`
- Socket.IO RPC handlers are in `io/rpc.js`
- Socket.IO event listeners are in `io/eventor.js`
- Example Postgres trigger helpers are under `db/schema.sql`

The login flow is email based and sends a one‑time password (OTP). When running
locally you may need an SMTP service or you can inspect the database to obtain
the code for testing.

## Development

Install dependencies in both the root folder and `client_dev`:

```bash
npm install
(cd client_dev && npm install)
```

Start the development server with:

```bash
npm run dev
```

This launches the Express/Socket.IO server using nodemon and serves the demo
client from `client_dev`.
