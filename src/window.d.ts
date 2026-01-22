export {}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: {
      APPLICATION_NAME?: string
      AUTH_API_URL?: string
      CLIENT_APP_URL?: string
      API_GATEWAY_URL?: string
      CONFIG_API_URL?: string
      LOGIN_URL?: string
      AUTH_URL?: string
      MINIO_URL?: string
      MINIO_BASE_URL?: string
      MINIO_BUCKET?: string
      COUNTRY_CONFIG_URL?: string
      COUNTRY?: string
      LANGUAGES?: string
      SENTRY?: string
      FEATURES?: Record<string, boolean>
      DASHBOARDS?: Array<{
        id: string
        title: {
          id: string
          defaultMessage: string
          description: string
        }
        url: string
        context?: {
          auth?: 'query' | 'postMessage'
        }
      }>
    }
  }
}
