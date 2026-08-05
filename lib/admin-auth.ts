import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function adminCodeMatches(candidate: string) {
  const expected = process.env.ADMIN_ACCESS_CODE;
  return Boolean(expected) && timingSafeEqual(digest(candidate), digest(expected!));
}

export function createAdminToken() {
  const code = process.env.ADMIN_ACCESS_CODE;
  if (!code) return "";
  const issuedAt = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  const signature = createHmac("sha256", code).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function adminTokenMatches(candidate?: string | null) {
  const code = process.env.ADMIN_ACCESS_CODE;
  if (!candidate || !code) return false;
  const [issuedAt, nonce, signature] = candidate.split(".");
  if (!issuedAt || !nonce || !signature || Date.now() - Number(issuedAt) > 2 * 60 * 60 * 1000) return false;
  const expected = createHmac("sha256", code).update(`${issuedAt}.${nonce}`).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function requestHasAdminToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return adminTokenMatches(authorization?.replace(/^Bearer\s+/i, ""));
}
