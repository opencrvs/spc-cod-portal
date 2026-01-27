export const EXTERNAL_LOGIN_URL =
  import.meta.env.EXTERNAL_LOGIN_URL || `http://localhost:3020`
export const LOGIN_REDIRECT_URL =
  import.meta.env.LOGIN_REDIRECT_URL || 'http://localhost:3069'
export const EXTERNAL_CLIENT_URL =
  import.meta.env.EXTERNAL_CLIENT_URL || `http://localhost:3000`
export const EXTERNAL_LOGIN_URL_WITH_REDIRECT = `${EXTERNAL_LOGIN_URL}?lang=en&redirectTo=${LOGIN_REDIRECT_URL}/login`
