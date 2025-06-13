const { io } = require('socket.io-client');

console.log('🔌 Testing Socket.IO connection with fix...');

const socket = io('https://localhost:3000', {
  path: '/api/socket/io',
  transports: ['polling', 'websocket'],
  rejectUnauthorized: false,
  timeout: 10000,
  forceNew: true
});

let connected = false;
let startTime = Date.now();

socket.on('connect', () => {
  connected = true;
  console.log(`✅ Connected successfully!`);
  console.log(`Socket ID: ${socket.id}`);
  console.log(`Connection time: ${Date.now() - startTime}ms`);
  
  // Test ping/pong
  socket.emit('ping');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log(`🔌 Disconnected: ${reason}`);
  connected = false;
});

socket.on('pong', () => {
  console.log('🏓 Pong received - connection is stable!');
});

// Test for 10 seconds
setTimeout(() => {
  console.log(`\n📊 Final Results:`);
  console.log(`- Connected: ${connected}`);
  console.log(`- Socket ID: ${socket.id || 'N/A'}`);
  console.log(`- Status: ${connected ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  socket.disconnect();
  process.exit(connected ? 0 : 1);
}, 10000); 