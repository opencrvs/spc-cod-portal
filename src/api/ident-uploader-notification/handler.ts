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
import { logger, maskEmail } from '@countryconfig/logger'
import { sendEmail } from '../notification/email-service'
import { SENDER_EMAIL_ADDRESS } from '../notification/constant'
import { applicationConfig } from '../application/application-config'
import { LOGIN_URL } from '@countryconfig/constants'

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
        status: Joi.string().valid('success', 'rejected').required(),
        trackingId: Joi.string().required(),
        certKey: Joi.string().required()
      })
    )
    .min(1)
    .required()
})

export interface RecordsToEmail {
  status: 'success' | 'rejected'
  /** The tracking ID of the record for display in emails */
  trackingId?: string
  /** The cert key of the record for display in emails */
  certKey?: string
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
  const { recipient, records } = payload

  logger.info(
    `[IDENT-UPLOADER] Processing notification request for ${maskEmail(recipient.email)} with ${records.length} records`
  )

  if (process.env.NODE_ENV !== 'production') {
    logger.info(
      `[IDENT-UPLOADER] Development mode - would send email to ${recipient.email}`
    )
  }

  // Check if email delivery is configured
  if (applicationConfig.USER_NOTIFICATION_DELIVERY_METHOD !== 'email') {
    logger.info(
      `Skipping ident uploader notification: USER_NOTIFICATION_DELIVERY_METHOD is not 'email'`
    )
    return h
      .response({ success: true, message: 'Notification skipped' })
      .code(200)
  }

  const loginUrl = LOGIN_URL || 'https://login.spc-cod.opencrvs.org'
  const applicationName = applicationConfig.APPLICATION_NAME || 'OpenCRVS'

  // Build email content
  const emailBody = `
    <p>Dear ${recipient.name.firstname} ${recipient.name.surname},</p>
    
      ${records
        .map(
          (record) =>
            record.status === 'success' &&
            `<p>The following death records have been encoded with cause of death codes and are ready to view:</p>
    <ul><li>TrackingID: ${record.trackingId} / Certificate Key: ${record.certKey}</li></ul><>/p`
        )
        .join('')}

        ${records
          .map(
            (record) =>
              record.status === 'rejected' &&
              `<p>The following death records were rejected and could not be coded:</p>
    <ul><li>TrackingID: ${record.trackingId} / Certificate Key: ${record.certKey}</li></ul><>/p`
          )
          .join('')}
    
    <p>Login to <a href="${loginUrl}">${loginUrl}</a> to access these records.</p>
    <p>Best regards,<br>${applicationName}</p>
  `

  try {
    if (process.env.NODE_ENV === 'development') {
      logger.info(
        `Would send email to ${maskEmail(recipient.email)} with subject: Death Records Processed - Cause of Death Codes Updated`
      )
      return h.response({ success: true }).code(200)
    }

    await sendEmail({
      subject: 'Death Records Processed - Cause of Death Codes Updated',
      html: emailBody,
      from: SENDER_EMAIL_ADDRESS,
      to: recipient.email
    })

    logger.info(
      `Ident uploader notification sent successfully to ${maskEmail(recipient.email)}`
    )

    return h.response({ success: true }).code(200)
  } catch (error) {
    logger.error(`Failed to send ident uploader notification: ${error}`)
    return h
      .response({ success: false, message: 'Failed to send email' })
      .code(500)
  }
}
