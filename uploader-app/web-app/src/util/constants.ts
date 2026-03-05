import.meta.env.VITE_SCHEME || 'https'

export const GATEWAY_HOST =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:7070'
    : process.env.GATEWAY_URL

export const COUNTRY_CONFIG_HOST =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3040'
    : process.env.COUNTRY_CONFIG_URL

export const REQUIRED_HEADERS = [
  'UCCode',
  'SelectedCodes',
  'MultipleCodes',
  'CertificateKey',
  'Comments' // IRIS output
]
