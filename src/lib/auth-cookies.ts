type AuthCookiePayload = {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  provider?: string;
  accountType?: string;
};

export function appendAuthCookies(headers: Headers, payload: AuthCookiePayload) {
  if (payload.refreshToken) {
    headers.append(
      "Set-Cookie",
      `refreshToken=${payload.refreshToken}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );
  }

  if (payload.accessToken) {
    headers.append(
      "Set-Cookie",
      `accessToken=${payload.accessToken}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=86400`
    );
    headers.append(
      "Set-Cookie",
      "isLoggedIn=true; Path=/; SameSite=Lax; Max-Age=2592000"
    );
  }

  if (payload.userId) {
    headers.append(
      "Set-Cookie",
      `clientUserId=${payload.userId}; Path=/; SameSite=Lax; Max-Age=2592000`
    );
  }

  if (payload.provider) {
    headers.append(
      "Set-Cookie",
      `authProvider=${payload.provider}; Path=/; SameSite=Lax; Max-Age=2592000`
    );
  }

  if (payload.accountType) {
    headers.append(
      "Set-Cookie",
      `accountType=${payload.accountType}; Path=/; SameSite=Lax; Max-Age=2592000`
    );
  }
}

export function appendLogoutCookies(headers: Headers) {
  headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/api; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  headers.append(
    "Set-Cookie",
    "accessToken=; Path=/api; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  headers.append(
    "Set-Cookie",
    "isLoggedIn=; Path=/; SameSite=Lax; Max-Age=0"
  );
  headers.append(
    "Set-Cookie",
    "clientUserId=; Path=/; SameSite=Lax; Max-Age=0"
  );
  headers.append(
    "Set-Cookie",
    "authProvider=; Path=/; SameSite=Lax; Max-Age=0"
  );
  headers.append(
    "Set-Cookie",
    "accountType=; Path=/; SameSite=Lax; Max-Age=0"
  );
}
