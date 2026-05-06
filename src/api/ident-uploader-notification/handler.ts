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
        ucCode: Joi.string()
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
