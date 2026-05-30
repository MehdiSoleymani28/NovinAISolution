const { spawn } = require('child_process');
const fs = require('fs');

const LOG_FILE = '/tmp/next-supervisor.log';

function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg + '\n';
  fs.appendFileSync(LOG_FILE, line);
}

function startServer() {
  log('Starting Next.js server...');
  
  const child = spawn('node', [
    '--max-old-space-size=256',
    'node_modules/.bin/next', 'start', '--port', '3000'
  ], {
    cwd: '/home/z/my-project',
    env: Object.assign({}, process.env, {
      DATABASE_URL: 'file:/home/z/my-project/db/custom.db',
    }),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', function(data) {
    log('STDOUT: ' + data.toString().trim());
  });

  child.stderr.on('data', function(data) {
    log('STDERR: ' + data.toString().trim());
  });

  child.on('close', function(code) {
    log('Server exited with code ' + code);
    setTimeout(startServer, 5000);
  });

  child.on('error', function(err) {
    log('Server error: ' + err.message);
  });

  fs.writeFileSync('/tmp/next-server.pid', String(child.pid));
}

log('Supervisor started (PID: ' + process.pid + ')');
startServer();

setInterval(function() {
  log('Heartbeat OK');
}, 60000);
