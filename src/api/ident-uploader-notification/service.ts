import * as Hapi from '@hapi/hapi'
import { sendEmail } from '../notification/email-service'
import { SENDER_EMAIL_ADDRESS } from '../notification/constant'
import { applicationConfig } from '../application/application-config'
import { LOGIN_URL } from '@countryconfig/constants'
import { logger, maskEmail } from '@countryconfig/logger'
import { IdentUploaderNotificationPayload, RecordsToEmail } from './handler'

const renderSection = (
  records: RecordsToEmail[],
  intro: string,
  plural: boolean = true,
  isExternal: boolean = false
) => {
  if (!records.length) return ''
  const loginUrl = LOGIN_URL || 'https://login.spc-cod.opencrvs.org'
  return `
    <p>${intro}</p>
    <ul>
      ${records
        .map(
          (record) =>
            `<li>TrackingID: ${record.trackingId}${isExternal ? ` / Certificate Key: ${record.certKey}` : ''}${record.ucCode ? ` / UC Code: ${record.ucCode}` : ''}</li>`
        )
        .join('')}
    </ul>
    <p>
      Login to <a href="${loginUrl}">${loginUrl}</a> to access ${
        plural ? 'these records' : 'this record'
      }.
    </p>
  `
}

export async function sendCoDEmail(
  payload: IdentUploaderNotificationPayload,
  isExternal: boolean = false
): Promise<'success' | 'failed' | 'skipped'> {
  if (!payload.recipient.email) {
    return 'skipped'
  }
  logger.info(
    `[IDENT-UPLOADER] Processing notification request for ${maskEmail(payload.recipient.email)} with ${payload.records.length} records`
  )

  if (process.env.NODE_ENV !== 'production') {
    logger.info(
      `[IDENT-UPLOADER] Development mode - would send email to ${payload.recipient.email}`
    )
  }

  // Check if email delivery is configured
  if (applicationConfig.USER_NOTIFICATION_DELIVERY_METHOD !== 'email') {
    logger.info(
      `Skipping ident uploader notification: USER_NOTIFICATION_DELIVERY_METHOD is not 'email'`
    )
    return 'skipped'
  }

  const successRecords = payload.records.filter((r) => r.status === 'success')
  const rejectedRecords = payload.records.filter((r) => r.status === 'rejected')
  const correctedRecords = payload.records.filter(
    (r) => r.status === 'corrected'
  )

  const applicationName = applicationConfig.APPLICATION_NAME || 'OpenCRVS'

  // Build email content
  const emailBody = `
  <p>Dear ${payload.recipient.name.firstname} ${payload.recipient.name.surname},</p>

  ${renderSection(
    successRecords,
    !isExternal
      ? 'The following death records have been encoded with cause of death codes and are ready to view:'
      : 'The following death records have been encoded with cause of death codes and are ready for a registrar to import:'
  )}

  ${renderSection(
    rejectedRecords,
    'The following death records were rejected and could not be coded:'
  )}

  ${renderSection(
    correctedRecords,
    !isExternal
      ? 'The following death record has been corrected with new information and is ready to view:'
      : 'The following death record has been corrected with new information and is ready for a registrar to import:',
    false
  )}

  <p>Best regards,<br>${applicationName}</p>
`

  try {
    console.log('EMAIL BODY :>> ', emailBody)
    if (process.env.NODE_ENV === 'development') {
      logger.info(
        `Would send email to ${maskEmail(payload.recipient.email)} with subject: Death Records Processed - Cause of Death Codes Updated`
      )
      return 'success'
    }

    await sendEmail({
      subject: 'Death Records Processed - Cause of Death Codes Updated',
      html: emailBody,
      from: SENDER_EMAIL_ADDRESS,
      to: payload.recipient.email
    })

    logger.info(
      `Ident uploader notification sent successfully to ${maskEmail(payload.recipient.email)}`
    )

    return 'success'
  } catch (error) {
    logger.error(`Failed to send ident uploader notification: ${error}`)
    return 'failed'
  }
}
