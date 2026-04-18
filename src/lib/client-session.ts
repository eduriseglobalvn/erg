const LOGGED_IN_COOKIE_NAME = 'isLoggedIn'

export function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return null
  }

  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))

  if (!cookie) {
    return null
  }

  return cookie.slice(name.length + 1)
}

export function hasLoggedInCookie() {
  return readCookie(LOGGED_IN_COOKIE_NAME) === 'true'
}
