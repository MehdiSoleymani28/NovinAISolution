/**
 * Custom build script for NovinAI Solution
 * Handles database setup before Next.js build
 */
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const ENV_FILE = join(ROOT, '.env');
const DB_DIR = join(ROOT, 'db');

// Ensure DATABASE_URL is set - create .env if missing
function ensureEnv() {
  if (!existsSync(ENV_FILE)) {
    console.log('Creating .env file with default DATABASE_URL...');
    writeFileSync(ENV_FILE, 'DATABASE_URL=file:./db/custom.db\n');
  } else {
    console.log('.env file exists');
  }
}

// Ensure db directory exists
function ensureDbDir() {
  if (!existsSync(DB_DIR)) {
    console.log('Creating db directory...');
    mkdirSync(DB_DIR, { recursive: true });
  }
}

// Run a command and exit on failure
function run(cmd, label) {
  console.log(`\n>> ${label}...`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
    console.log(`   ${label} completed`);
  } catch (err) {
    console.error(`   ${label} failed`);
    process.exit(1);
  }
}

// Main build process
console.log('Starting NovinAI Solution build process...\n');

ensureEnv();
ensureDbDir();

run('npx prisma generate', 'Prisma Client Generation');
run('npx prisma db push --accept-data-loss', 'Database Setup');
run('npx next build', 'Next.js Build');

console.log('\nBuild completed successfully!');
