import { cleanEnv, url } from 'envalid'

export const env = cleanEnv(process.env, {
  GATEWAY_URL: url({ devDefault: 'http://localhost:7070' }),
  COUNTRY_CONFIG_URL: url({ devDefault: 'http://localhost:3040' }),
})


export const REQUIRED_HEADERS = [
  'UCCode',
  'SelectedCodes',
  'MultipleCodes',
  'CertificateKey',
  'Comments' // IRIS output
]
