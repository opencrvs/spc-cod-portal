export const REQUIRED_HEADERS = [
  'UCCode',
  'SelectedCodes',
  'MultipleCodes',
  'CertificateKey',
  'Status',
  'FreeText', // IRIS output
  'Comments' // IRIS output
]

export const UPLOADER_APP_URL =
  import.meta.env.VITE_UPLOADER_APP_URL || import.meta.env.UPLOADER_APP_URL || 'https://uploader.spc-cod-qa.opencrvs.org'

export const GATEWAY_HOST =
  import.meta.env.VITE_GATEWAY_URL || import.meta.env.GATEWAY_URL || 'http://localhost:7070'

export const COUNTRY_CONFIG_HOST =
  import.meta.env.VITE_COUNTRY_CONFIG_URL || import.meta.env.COUNTRY_CONFIG_URL || 'http://localhost:3040'