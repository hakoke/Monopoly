export default {
	CODE_PREFIX: "monopoly-game-prefix", // required - change this to your desired prefix
	PEER_SERVER_HOST: "YOUR_PEERJS_SERVER_URL_HERE", // REPLACE THIS after deploying peerjs-server to Railway (e.g., "monopoly-peerjs.up.railway.app")
	PEER_SERVER_PORT: 443, // optional, default 443
	PEER_SECURE: true, // REQUIRED for HTTPS sites - must be true when served over HTTPS
	PEER_DEBUG_LEVEL: 3, // Enable full debug logging to diagnose connection issues
};

