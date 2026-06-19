// OAuth 2.0 GitHub Authentication Flow
// Handles the full authorization code flow: open browser, capture redirect,
// exchange code for access token, and persist via crypto-vault.

export async function login(): Promise<string> {
  // TODO: launch GitHub OAuth authorization URL in system browser
  return '';
}

export async function logout() {
  // TODO: revoke token and clear from secure storage
}

export function getToken(): string | null {
  // TODO: return cached access token from secure storage
  return null;
}
