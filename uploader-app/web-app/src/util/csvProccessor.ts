import * as Papa from 'papaparse'
import { CSVRow, ProcessingResult, ProcessingSummary, RecordsToEmail } from './types'
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

    const trackingId = record.trackingId || id
    const certKey = id
    // Extract createdBy from legalStatuses.DECLARED.createdBy
    const createdBy = getCreatedByFromLegalStatuses(record.legalStatuses)

    if (rowStatus === 'Rejected') {
      const rejectReason = row.RejectReason

      return {
        rowIndex,
        id,
        status: 'rejected',
        message: `Record with ID "${id}" has status Rejected`,
        createdBy: createdBy || undefined,
        trackingId,
        certKey
      }
    }

    
    

    return {
      rowIndex,
      id,
      status: 'success',
      message: 'Successfully updated with IRIS output data',
      createdBy: createdBy || undefined,
      trackingId,
      certKey
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
  // Filter successful or rejected results that have a createdBy user
  const successfulOrRejectedResults = results.filter(
    (r) => (r.status === 'success' || r.status === 'rejected') && r.createdBy
  )

  if (successfulOrRejectedResults.length === 0) {
    return
  }

  // Group ALL records by createdBy user - one entry per user with all their records
  const recordsByUser = new Map<string, RecordsToEmail[]>()
  for (const result of successfulOrRejectedResults) {
    if (result.createdBy) {
      const existing = recordsByUser.get(result.createdBy) || []
      existing.push({ "status": result.status, "trackingId": result.trackingId || result.id, "certKey": result.certKey || result.id })
      recordsByUser.set(result.createdBy, existing)
    }
  }

  // Send ONE email per user with ALL their records
  for (const [userId, records] of recordsByUser) {
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
        records
      )
      console.log(
        `[EMAIL-NOTIFICATION] Email sent to user ${userId} for ${records.length} records. Result:`,
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
