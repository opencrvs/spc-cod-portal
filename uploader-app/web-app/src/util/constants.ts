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

  export const TUVALU_CLIENT_ID =
  import.meta.env.VITE_TUVALU_CLIENT_ID || import.meta.env.TUVALU_CLIENT_ID || ''

  export const TUVALU_CLIENT_SECRET =
  import.meta.env.VITE_TUVALU_CLIENT_SECRET || import.meta.env.TUVALU_CLIENT_SECRET || ''

  export const TUVALU_AUTH_URL =
  import.meta.env.VITE_TUVALU_AUTH_URL || import.meta.env.TUVALU_AUTH_URL || 'https://auth.pankaj-qa.opencrvs.dev'

  export const TUVALU_SPC_CODING_URL =
  import.meta.env.VITE_TUVALU_SPC_CODING_URL || import.meta.env.TUVALU_SPC_CODING_URL || 'https://countryconfig.pankaj-qa.opencrvs.dev/spc-coding'