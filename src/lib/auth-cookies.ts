type AuthCookiePayload = {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  provider?: string;
  accountType?: string;
};

const ACCESS_COOKIE_NAME = "erg_access_token";
const REFRESH_COOKIE_NAME = "erg_refresh_token";

function cookieBase(maxAge: number, httpOnly = false, path = "/") {
  const domain = process.env.AUTH_COOKIE_DOMAIN || process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "";
  return [
    `Path=${path}`,
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    domain ? `Domain=${domain}` : "",
    process.env.NODE_ENV === "production" ? "Secure" : "",
    httpOnly ? "HttpOnly" : "",
  ].filter(Boolean).join("; ");
}

export function appendAuthCookies(headers: Headers, payload: AuthCookiePayload) {
  if (payload.refreshToken) {
    headers.append(
      "Set-Cookie",
      `${REFRESH_COOKIE_NAME}=${payload.refreshToken}; ${cookieBase(2592000, true)}`
    );
  }

  if (payload.accessToken) {
    headers.append(
      "Set-Cookie",
      `${ACCESS_COOKIE_NAME}=${payload.accessToken}; ${cookieBase(86400, true)}`
    );
    headers.append(
      "Set-Cookie",
      `isLoggedIn=true; ${cookieBase(2592000)}`
    );
  }

  if (payload.userId) {
    headers.append(
      "Set-Cookie",
      `clientUserId=${payload.userId}; ${cookieBase(2592000)}`
    );
  }

  if (payload.provider) {
    headers.append(
      "Set-Cookie",
      `authProvider=${payload.provider}; ${cookieBase(2592000)}`
    );
  }

  if (payload.accountType) {
    headers.append(
      "Set-Cookie",
      `accountType=${payload.accountType}; ${cookieBase(2592000)}`
    );
  }
}

export function appendLogoutCookies(headers: Headers) {
  for (const name of [
    REFRESH_COOKIE_NAME,
    ACCESS_COOKIE_NAME,
    "isLoggedIn",
    "clientUserId",
    "authProvider",
    "accountType",
  ]) {
    headers.append("Set-Cookie", `${name}=; ${cookieBase(0, name.includes("token") || name.includes("Token"))}`);
  }
  headers.append("Set-Cookie", `refreshToken=; ${cookieBase(0, true, "/api")}`);
  headers.append("Set-Cookie", `accessToken=; ${cookieBase(0, true, "/api")}`);
}
