export function isValidToken(token: string): boolean {
  const trimmedToken = token.trim();
  if (trimmedToken.length === 0) return false;
  const validPrefixes = ["link-sandbox", "link-production", "link-devenv"];
  return validPrefixes.some((prefix) => trimmedToken.startsWith(prefix));
}

export function getTokenValidationError(token: string): string | null {
  if (token.trim().length === 0) return null;
  return isValidToken(token)
    ? null
    : 'A valid token starts with "link-sandbox", "link-production", or "link-devenv"';
}
