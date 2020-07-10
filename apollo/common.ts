export const isServer = () => typeof window === 'undefined'
export const graphPath = '/api/graphql'
export const fallbackURL = `${process.env.NEXT_PUBLIC_YUM_SERVER_URL}${graphPath}`
export const getServerURL = () =>
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}${graphPath}` : fallbackURL
export const getClientURL = () =>
  `${window.location.protocol}://${window.location.host}${graphPath}` || fallbackURL
