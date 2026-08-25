import * as Papa from 'papaparse'
import {
  CSVRow,
  ProcessingResult,
  ProcessingSummary,
  RecordsToEmail
} from './types'
import {
  findRecordByCertificateKey,
  updateRecordWithCauseOfDeath,
  getCreatedByFromLegalStatuses,
  getUserById,
  sendProcessingNotificationEmail,
  notifyCodedRecordsExternally,
  clearExternalRecords
} from '../services/recordService'
import {
  REQUIRED_HEADERS,
  CountryCode,
  COUNTRY_CODES,
  COUNTRY_CONFIG_HOST
} from './constants'

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

type ExternalSpcCodingDatabaseRecord = {
  trackingId: string
  status: string
  ucCode: string
  selectedCodes: string
  multipleCodes: string
  freeText: string
  comments: string
}

type SubmitEncodingExternallyPayload = {
  countryCode: string
  record: ExternalSpcCodingDatabaseRecord
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

  if (!rowStatus) {
    return {
      rowIndex,
      id: '',
      status: 'error',
      message: 'Row is missing a Status'
    }
  }

  if (
    rowStatus === 'Rejected' &&
    (!row.FreeText || row.FreeText.trim() === '')
  ) {
    return {
      rowIndex,
      id: '',
      status: 'error',
      message: 'Row is missing a Free Text value for a rejected record'
    }
  }

  if (rowStatus === 'Final' && (!row.UCCode || row.UCCode.trim() === '')) {
    return {
      rowIndex,
      id: '',
      status: 'error',
      message: 'Row is missing a UC Code value for a coded record'
    }
  }

  let assignedTo = ''
  // Check if there are any IRIS output fields to update
  const hasIrisData =
    row.UCCode ||
    row.SelectedCodes ||
    row.MultipleCodes ||
    row.Comments ||
    row.FreeText

  try {
    try {
      const prefix = 'EXT_'
      if (id.includes(prefix) && hasIrisData) {
        // External record
        const [, countryCode, trackingId] = id.split('_')
        const externalRecord: ExternalSpcCodingDatabaseRecord = {
            trackingId,
            status: rowStatus,
            ucCode: row.UCCode || '',
            selectedCodes: row.SelectedCodes || '',
            multipleCodes: row.MultipleCodes || '',
            freeText: row.FreeText || '',
            comments: row.Comments || ''
          }

          const externalPayload: SubmitEncodingExternallyPayload = {
              countryCode,
              record: externalRecord
            }
        
          console.log('Sending to external system: ', JSON.stringify(externalPayload))

         const url = new URL(
            'submit-coded-record-externally',
            COUNTRY_CONFIG_HOST
          ).toString()

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(externalPayload)
          })

          if (!response.ok) {
            const errorText = await response.text()
            return {
              rowIndex,
              id,
              status: 'error',
              message: `Country could not process the updated record an error: ${errorText}`
            }
          }

          await clearExternalRecords(token, id) 

          return {
            rowIndex,
            id,
            status: 'success',
            message: 'Iris response sent to country successfully',
            createdBy: undefined,
            trackingId,
            certKey: id,
            ucCode: row.UCCode
          }
        
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      return {
        rowIndex,
        id,
        status: 'error',
        message: `Country could not receive the updated record an error: ${errorMessage}`
      }
    }

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
    assignedTo = record?.assignedTo || ''
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

    if (!hasIrisData) {
      return {
        rowIndex,
        id,
        status: 'skipped',
        message:
          'No IRIS output data (UCCode, SelectedCodes, MultipleCodes, Comments, FreeText) found in row'
      }
    }

    const updated = await updateRecordWithCauseOfDeath(token, record, row)

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
      certKey,
      ucCode: row.UCCode
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'CONFLICT') {
      const userInfo = await getUserById(token, assignedTo)
      if (userInfo) {
        return {
          rowIndex,
          id,
          status: 'error',
          message: `Unable to process this record because it is currently assigned to ${userInfo.firstName} ${userInfo.lastName}. Please ask ${userInfo.firstName} ${userInfo.lastName} to unassign the record first, then re-upload the CSV to process this record again.`
        }
      } else {
        // should not happen as assignedTo should have a value now
        return {
          rowIndex,
          id,
          status: 'error',
          message: `Unable to process this record because it is currently assigned to another unknown user. Please ask them to unassign the record first, then re-upload the CSV to process this record again.`
        }
      }
    } else {
      return {
        rowIndex,
        id,
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

export const processCSV = async (
  rows: CSVRow[],
  token: string,
  onProgress?: (
    current: number,
    total: number,
    currentCertificateKey: string
  ) => void
): Promise<ProcessingSummary> => {
  const results: ProcessingResult[] = []

  for (let i = 0; i < rows.length; i++) {
    const result = await processCSVRow(rows[i], i + 1, token)
    results.push(result)

    if (onProgress) {
      onProgress(i + 1, rows.length, rows[i].CertificateKey?.trim() || '')
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

  console.log(JSON.stringify(results, null, 2))
  // Send email notifications - one email per user with all their processed records
  await sendEmailNotifications(token, results)

  return summary
}

/**
 * Send email notifications to users about their processed records.
 * Groups all successful records by createdBy user and sends ONE email per user
 * containing all their processed record IDs.
 */


function toRecordToEmail(record: ProcessingResult): RecordsToEmail {
  return {
    status: record.status,
    trackingId: record.trackingId || record.id,
    certKey: record.certKey || record.id,
    ucCode: record.ucCode || ''
  }
}

function groupByUser(records: ProcessingResult[]) {
  const grouped = new Map<string, RecordsToEmail[]>()

  for (const record of records) {
    const userRecords = grouped.get(record.createdBy!) ?? []

    userRecords.push(toRecordToEmail(record))

    grouped.set(record.createdBy!, userRecords)
  }

  return grouped
}

async function sendEmailNotifications(
  token: string,
  results: ProcessingResult[]
): Promise<void> {
  const internalRecords: ProcessingResult[] = []

  const externalRecordsByCountry = new Map<
    CountryCode,
    RecordsToEmail[]
  >()

  for (const record of results) {
    if (record.status !== 'success' && record.status !== 'rejected') {
      continue
    }

    const externalCountry = COUNTRY_CODES.find((countryCode) =>
      record.certKey?.startsWith(`EXT_${countryCode}`)
    )

    if (externalCountry) {
      const countryRecords =
        externalRecordsByCountry.get(externalCountry) ?? []

      countryRecords.push(toRecordToEmail(record))
      externalRecordsByCountry.set(externalCountry, countryRecords)

      continue
    }

    if (!record.createdBy) {
      continue
    }

    internalRecords.push(record)
  }
  console.log("internalRecords: ", JSON.stringify(internalRecords))
  console.log("externalRecordsByCountry: ", externalRecordsByCountry)

  // Internal notifications
  for (const [userId, records] of groupByUser(internalRecords)) {
    try {
      const user = await getUserById(token, userId)

      if (!user?.email) continue

      await sendProcessingNotificationEmail(token, user, records)

      console.log(
        `[EMAIL-NOTIFICATION] Email sent to ${userId} for ${records.length} records.`
      )
    } catch (error) {
      console.error(
        `[EMAIL-NOTIFICATION] Error sending email to ${userId}:`,
        error
      )
    }
  }


  // External notifications
  for (const [countryCode, records] of externalRecordsByCountry) {
    try {
      await notifyCodedRecordsExternally(
        token,
        records,
        countryCode
      )

      console.log(
        `[EXTERNAL-NOTIFICATION] Sent ${records.length} records to ${countryCode}.`
      )
    } catch (error) {
      console.error(
        `[EXTERNAL-NOTIFICATION] Error sending records to ${countryCode}:`,
        error
      )
    }
  }
}