const isDevelopment = process.env.NODE_ENV === 'development'

export function devLog(...args: unknown[]) {
  if (!isDevelopment) {
    return
  }

  console.log(...args)
}

export function devWarn(...args: unknown[]) {
  if (!isDevelopment) {
    return
  }

  console.warn(...args)
}
