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
import * as Hapi from '@hapi/hapi'
import * as Joi from 'joi'
import { sendCoDEmail } from './service'
import {
  TUVALU_SPC_CODING_URL,
  TUVALU_CLIENT_SECRET,
  TUVALU_CLIENT_ID,
  TUVALU_AUTH_URL
} from '@countryconfig/constants'

/**
 * Payload schema for ident uploader notification
 */
export const identUploaderNotificationSchema = Joi.object({
  recipient: Joi.object({
    name: Joi.object({
      firstname: Joi.string().required(),
      surname: Joi.string().required()
    }).required(),
    email: Joi.string().email().required()
  }).required(),
  records: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .valid('success', 'rejected', 'corrected')
          .required(),
        trackingId: Joi.string().required(),
        certKey: Joi.string().required(),
        ucCode: Joi.string().allow('')
      })
    )
    .min(1)
    .required()
})

export interface RecordsToEmail {
  status: 'success' | 'rejected' | 'corrected'
  /** The tracking ID of the record for display in emails */
  trackingId?: string
  /** The cert key of the record for display in emails */
  certKey?: string
  /** The uc code of the record for display in emails */
  ucCode?: string
}

export interface IdentUploaderNotificationPayload {
  recipient: {
    name: {
      firstname: string
      surname: string
    }
    email: string
  }
  records: RecordsToEmail[]
}

/**
 * Handler for ident uploader notifications.
 * Sends an email to a specific user (registrar) about their processed death records.
 */
export async function identUploaderNotificationHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const payload = request.payload as IdentUploaderNotificationPayload

  return await sendCoDEmail(payload, h)
}

export const externalSpcCodingDatabaseRecordSchema = Joi.object({
  trackingId: Joi.string().required(),
  status: Joi.string().required(),
  ucCode: Joi.string().required(),
  selectedCodes: Joi.string().required(),
  multipleCodes: Joi.string().required(),
  freeText: Joi.string().required(),
  comments: Joi.string().required()
})

type ExternalSpcCodingDatabaseRecord = {
  trackingId: string
  status: string
  ucCode: string
  selectedCodes: string
  multipleCodes: string
  freeText: string
  comments: string
}

type TokenResponse = { access_token: string; token_type: string }

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  countryAuthBase: string
): Promise<string> {
  if (!clientId || !clientSecret) {
    throw new Error('CLIENT_ID or CLIENT_SECRET not set in environment')
  }

  const url = new URL('/token', countryAuthBase)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('client_secret', clientSecret)
  url.searchParams.set('grant_type', 'client_credentials')

  console.log('Requesting access token from:', url.toString())
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok)
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`)

  const data = (await res.json()) as TokenResponse
  if (!data.access_token) throw new Error('Token response missing access_token')
  return data.access_token
}

export async function submitCodedRecordExternally(request: Hapi.Request) {
  const token = await getAccessToken(
    TUVALU_CLIENT_ID || '',
    TUVALU_CLIENT_SECRET || '',
    TUVALU_AUTH_URL
  )
  // TODO: get TUVALU_CLIENT_ID, TUVALU_CLIENT_SECRET, TUVALU_COUNTRY_CONFIG_URL from VITE vars
  const externalRecord = request.payload as ExternalSpcCodingDatabaseRecord

  console.log('Sending to Tuvalu: ', JSON.stringify(externalRecord))

  return await fetch(TUVALU_SPC_CODING_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(externalRecord)
  })
}
