// Apex Bridge REST API Integration
// Handles HTTP communication between the VS Code extension and the
// local Apex Bridge server (ApiBridgeManager on 127.0.0.1:3000).

export async function sendParams(payload: unknown) {
  // TODO: POST /api/params
  void payload;
}

export async function handshake(payload: unknown) {
  // TODO: POST /api/handshake
  void payload;
}

export async function healthCheck() {
  // TODO: GET /api/health
}
