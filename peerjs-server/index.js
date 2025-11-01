const { PeerServer } = require('peer');

const port = process.env.PORT || 9000;

const server = PeerServer({
  port: port,
  path: '/',
  allow_discovery: true,
  proxied: true,
  ssl: {}
});

console.log(`🚀 PeerJS Server running on port ${port}`);
console.log(`📡 Ready to accept peer connections`);

server.on('connection', (client) => {
  console.log(`✅ Client connected: ${client.getId()}`);
});

server.on('disconnect', (client) => {
  console.log(`❌ Client disconnected: ${client.getId()}`);
});

