import * as Papa from 'papaparse'
import { CSVRow, ProcessingResult, ProcessingSummary, UserInfo } from './types'
import {
  findRecordByCertificateKey,
  updateRecordWithCauseOfDeath,
  getCreatedByFromLegalStatuses,
  getUserById,
  sendProcessingNotificationEmail
} from '../services/recordService'
import { REQUIRED_HEADERS } from './constants'

export const validateCSVHeaders = (
  headers: string[]
): { isValid: boolean; missingHeaders: string[] } => {
  const missingHeaders = REQUIRED_HEADERS.filter(
    (required) => !headers.includes(required)
  )

  return {
    isValid: missingHeaders.length === 0,
    missingHeaders
  }
}

export const parseCSV = (file: File): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSV parsing failed: ' + results.errors[0].message))
          return
        }

        if (results.data.length === 0) {
          reject(new Error('CSV file is empty'))
          return
        }

        // Validate headers
        const headers = Object.keys(results.data[0])
        const validation = validateCSVHeaders(headers)

        if (!validation.isValid) {
          reject(
            new Error(
              `CSV format is incorrect. Missing required headers: ${validation.missingHeaders.join(', ')}`
            )
          )
          return
        }

        resolve(results.data)
      },
      error: (error) => {
        reject(new Error('Failed to parse CSV: ' + error.message))
      }
    })
  })
}

export const processCSVRow = async (
  row: CSVRow,
  rowIndex: number,
  token: string
): Promise<ProcessingResult> => {
  const id = row.CertificateKey?.trim()

  if (!id) {
    return {
      rowIndex,
      id: '',
      status: 'error',
      message: 'Row is missing a CertificateKey'
    }
  }

  try {
    const record = await findRecordByCertificateKey(token, id)

    if (!record) {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message: `Record with ID "${id}" not found in database`
      }
    }

    // Check if there are any IRIS output fields to update
    const hasIrisData =
      row.UCCode || row.SelectedCodes || row.MultipleCodes || row.Comments

    if (!hasIrisData) {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message:
          'No IRIS output data (UCCode, SelectedCodes, MultipleCodes, Comments) found in row'
      }
    }

    console.log('[DEBUG] processCSVRow - hasIrisData :>> ', hasIrisData)

    const updated = await updateRecordWithCauseOfDeath(
      token,
      record.id,
      row,
      record.declaration
    )
    console.log(
      '[DEBUG] processCSVRow - updateRecordWithCauseOfDeath returned:',
      updated
    )

    if (!updated) {
      return {
        rowIndex,
        id,
        status: 'error',
        message: 'Failed to update record'
      }
    }

    // Extract createdBy from legalStatuses.DECLARED.createdBy
    const createdBy = getCreatedByFromLegalStatuses(record.legalStatuses)
    const trackingId = record.trackingId || id

    return {
      rowIndex,
      id,
      status: 'success',
      message: 'Successfully updated with IRIS output data',
      createdBy: createdBy || undefined,
      trackingId
    }
  } catch (error) {
    console.log('[DEBUG] processCSVRow - Error:', error)
    return {
      rowIndex,
      id,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export const processCSV = async (
  rows: CSVRow[],
  token: string,
  onProgress?: (current: number, total: number) => void
): Promise<ProcessingSummary> => {
  const results: ProcessingResult[] = []

  for (let i = 0; i < rows.length; i++) {
    const result = await processCSVRow(rows[i], i + 1, token)
    results.push(result)

    if (onProgress) {
      onProgress(i + 1, rows.length)
    }
  }

  const summary: ProcessingSummary = {
    total: results.length,
    successful: results.filter((r) => r.status === 'success').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
    results
  }

  console.log('processCSV >>>>>>> summary :>> ', summary)
  console.log('processCSV >>>>>>> results :>> ', results)

  // Send email notifications - one email per user with all their processed records
  await sendEmailNotifications(token, results)

  return summary
}

/**
 * Send email notifications to users about their processed records.
 * Groups all successful records by createdBy user and sends ONE email per user
 * containing all their processed record IDs.
 */
async function sendEmailNotifications(
  token: string,
  results: ProcessingResult[]
): Promise<void> {
  // Filter successful results that have a createdBy user
  const successfulResults = results.filter(
    (r) => r.status === 'success' && r.createdBy
  )

  if (successfulResults.length === 0) {
    console.log(
      '[DEBUG] sendEmailNotifications - No successful records with createdBy to notify'
    )
    return
  }

  // Group ALL records by createdBy user - one entry per user with all their records
  const recordsByUser = new Map<string, string[]>()
  for (const result of successfulResults) {
    if (result.createdBy) {
      const existing = recordsByUser.get(result.createdBy) || []
      existing.push(result.trackingId || result.id)
      recordsByUser.set(result.createdBy, existing)
    }
  }

  console.log(
    `[DEBUG] sendEmailNotifications - Sending emails to ${recordsByUser.size} unique users`
  )

  // Send ONE email per user with ALL their records
  for (const [userId, recordIds] of recordsByUser) {
    try {
      const userInfo = await getUserById(token, userId)
      if (!userInfo) {
        console.warn(
          `[DEBUG] sendEmailNotifications - Could not find user ${userId}, skipping email`
        )
        continue
      }

      if (!userInfo.email) {
        console.warn(
          `[DEBUG] sendEmailNotifications - User ${userId} has no email, skipping`
        )
        continue
      }

      console.log(
        `[DEBUG] sendEmailNotifications - Sending ONE email to ${userInfo.email} with ${recordIds.length} record IDs`
      )

      // Send single email with all record IDs for this user
      await sendProcessingNotificationEmail(token, userInfo, recordIds)
    } catch (error) {
      console.error(
        `[DEBUG] sendEmailNotifications - Error sending email to user ${userId}:`,
        error
      )
    }
  }
}
