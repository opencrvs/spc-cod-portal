/* eslint-disable no-console */
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */

import { inspect } from 'util'

const TOKEN_ENDPOINT = 'https://icdaccessmanagement.who.int/connect/token'
const ICD_ENDPOINT = 'https://id.who.int/icd/entity'

const CLIENT_ID =
  process.env.WHO_CLIENT_ID ??
  '45bde629-b6e6-44a3-906d-0d3d1dac133b_096bd531-3687-4c89-84ec-40aa792adaf7'
const CLIENT_SECRET =
  process.env.WHO_CLIENT_SECRET ??
  'fVTjTXkTk26Pmq0EjZ3GUCFXYPNqG/f9nReoDYjG5jA='
const scope = 'icdapi_access'

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status}`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

async function callICDAPI(token: string) {
  const res = await fetch(ICD_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Accept-Language': 'en',
      'API-Version': 'v2'
    }
  })

  if (!res.ok) {
    console.error('ICD API error:', res.status)
    const text = await res.text()
    console.error(text)
    return
  }

  const content = await res.text()
  console.log(
    inspect(JSON.parse(content), {
      depth: null,
      colors: true
    })
  )
}

;(async () => {
  try {
    const token = await getAccessToken()
    console.log('Access token obtained successfully. Token: ', token)
    await callICDAPI(token)
  } catch (err) {
    console.error(err)
  }
})()
