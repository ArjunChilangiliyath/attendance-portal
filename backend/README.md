# Backend

Node.js + Express API using Prisma ORM and MySQL.

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

Add the application entry files (`server.js`, `app.js`), Prisma schema, routes,
controllers, repositories, middleware and utilities as the implementation is built.
Do not commit `.env` or real credentials.
