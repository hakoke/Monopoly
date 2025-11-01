# Monopoly PeerJS Server

This is the signaling server for the Monopoly multiplayer game.

## Deployment

This service is designed to be deployed on Railway as a separate service from the main Monopoly app.

### Railway Configuration:
- **Root Directory:** `peerjs-server`
- **Start Command:** `npm start` (auto-detected)
- **Port:** Railway will set `PORT` environment variable automatically

## What This Does

Provides WebRTC signaling for peer-to-peer connections between Monopoly game clients.

## Local Development

```bash
cd peerjs-server
npm install
npm start
```

Server will run on port 9000 (or PORT env variable).

