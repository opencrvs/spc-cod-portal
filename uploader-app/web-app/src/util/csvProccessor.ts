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
  const rowStatus = row.Status

  if (!id) {
    return {
      rowIndex,
      id: '',
      status: 'error',
      message: 'Row is missing a CertificateKey'
    }
  }

  try {

    // If 

    // id is of the format: `EXTERNAL_OPENCRVS_RECORD_$(countryCode)_$(trackingId)`
    // Then instead of processing it here, we send it back to the country via an API

    // authenticate with the country API using environment variables in this portal
    // Each country needs to create a system client and share e.g.:
    // PANKAJLAND_CLIENT_ID, PANKAJLAND_CLIENT_SECRET, PANKAJLAND_ENCODE_URL
    // COOKS_CLIENT_ID, COOKS_CLIENT_SECRET, COOKS_ENCODE_URL

    /* 

    if a 200 is received from the country API
    
    // we must update the row in the analytics table with REGISTERED status so that it is removed from the IDENT & MEDCOD download queue
    // Then it can not be mistakenly processed again in the future

    return {
      rowIndex,
      id,
      status: 'success',
      message: 'Successfully returned',
      createdBy: createdBy || undefined,
      trackingId
    }

    else if a 400 is received from the country API

    // we must log this error and send an email alert to the admin containing any log information

    return {
        rowIndex,
        id,
        status: 'error',
        message: 'Country could not receive the updated record due to a network error'
      }
      
    */

    // Else continue
    const record = await findRecordByCertificateKey(token, id)

    if (!record) {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message: `Record with ID "${id}" not found in database`
      }
    }

    const markedAsRegisteredInOcrvs = record.status === 'REGISTERED'
    const markedAsRejectedInOcrvs = record.flags?.includes('rejected')

    if (markedAsRegisteredInOcrvs) {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message: `Record with ID "${id}" has already been registered`
      }
    }

    if (markedAsRejectedInOcrvs && rowStatus === 'Rejected') {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message: `Record with ID "${id}" has already been rejected`
      }
    }

    // Check if there are any IRIS output fields to update
    const hasIrisData =
      row.UCCode || row.SelectedCodes || row.MultipleCodes || row.Comments || row.FreeText

    if (!hasIrisData) {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message:
          'No IRIS output data (UCCode, SelectedCodes, MultipleCodes, Comments, FreeText) found in row'
      }
    }

    const updated = await updateRecordWithCauseOfDeath(
      token,
      record,
      row
    )

    if (!updated) {
      return {
        rowIndex,
        id,
        status: 'error',
        message: 'Failed to update record'
      }
    }

    if (rowStatus === 'Rejected') {
      const rejectReason = row.RejectReason

      return {
        rowIndex,
        id,
        status: 'rejected',
        message: `Record with ID "${id}" has status Rejected`
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
    rejected: results.filter((r) => r.status === 'rejected').length,
    results
  }

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

  // Send ONE email per user with ALL their records
  for (const [userId, recordIds] of recordsByUser) {
    try {
      const userInfo = await getUserById(token, userId)
      if (!userInfo) {
        continue
      }

      if (!userInfo.email) {
        continue
      }

      // Send single email with all record IDs for this user
      const result = await sendProcessingNotificationEmail(
        token,
        userInfo,
        recordIds
      )
      console.log(
        `[EMAIL-NOTIFICATION] Email sent to user ${userId} for ${recordIds.length} records. Result:`,
        result
      )
    } catch (error) {
      console.error(
        `[EMAIL-NOTIFICATION] Error sending email to user ${userId}:`,
        error
      )
    }
  }
}
