
import 'dotenv/config';

import app from './app.js';
import { env } from './src/config/env.js';
import { prisma } from './src/config/database.js';

const server = app.listen(env.port, () => {
  console.log(`API listening on port ${env.port}`);
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
