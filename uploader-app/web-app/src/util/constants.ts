export const SCHEME = import.meta.env.VITE_SCHEME || 'https'

export const GATEWAY_HOST =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:7070'
    : SCHEME + '://gateway.'

export const REQUIRED_HEADERS = [
  'UCCode',
  'SelectedCodes',
  'MultipleCodes',
  'CertificateKey',
  'Comments' // IRIS output
]
