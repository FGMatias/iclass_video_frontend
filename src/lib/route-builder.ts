export const buildRoute = (path: string, params?: Record<string, string | number>): string => {
  if (!params) return path

  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`:${key}`, String(value)),
    path,
  )
}
