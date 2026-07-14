import 'dotenv/config';
import { createAdmin, validateAdmin } from './auth.js';
import { initSchema } from './db.js';

async function main() {
  await initSchema();
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const admin = await createAdmin(username, password);
  console.log('Admin criado:', admin);
  const auth = await validateAdmin(username, password);
  console.log('Token:', auth?.token);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
