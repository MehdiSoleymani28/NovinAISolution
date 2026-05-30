#!/usr/bin/env node
/**
 * Start Next.js production server with proper lifecycle management.
 * This script keeps the server process alive and handles errors gracefully.
 */
const { spawn } = require('child_process');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || 'file:' + path.join(__dirname, 'db', 'custom.db');

console.log('Starting Next.js production server...');
console.log('DATABASE_URL:', DATABASE_URL);

const child = spawn('node', [
  '--max-old-space-size=512',
  'node_modules/.bin/next',
  'start',
  '--port', '3000',
], {
  cwd: __dirname,
  env: { ...process.env, DATABASE_URL },
  stdio: 'inherit',
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log(`Server exited with code=${code} signal=${signal}`);
  if (code !== 0) {
    console.log('Restarting server in 3 seconds...');
    setTimeout(() => {
      // Re-execute self
      const { execSync } = require('child_process');
      execSync('node ' + __filename, { stdio: 'inherit', env: { ...process.env, DATABASE_URL } });
    }, 3000);
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});
