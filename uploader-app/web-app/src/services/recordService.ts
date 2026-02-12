import { GATEWAY_HOST } from '../util/constants'
import { createClient } from '@opencrvs/toolkit/api'
import { v4 as uuidv4 } from 'uuid'
import { getDecodedToken } from './token'

export interface DeathRecord {
  id: string
  type: string
  status: string
  legalStatuses?: Record<string, any>
  createdAt?: string
  dateOfEvent?: string
  placeOfEvent?: string
  createdBy?: string
  createdByUserType?: string
  updatedByUserRole?: string
  createdAtLocation?: string
  updatedAtLocation?: string
  updatedAt?: string
  updatedBy?: string
  trackingId?: string
  potentialDuplicates?: string[]
  flags?: string[]
  declaration: Record<string, string>
}

export interface SearchResult {
  results: DeathRecord[]
  total: number
}

/**
 * Find a death record by CertificateKey using the OpenCRVS search API
 */
export async function findRecordByCertificateKey(
  token: string,
  certificateKey: string
): Promise<DeathRecord | null> {
  const url = new URL('events', GATEWAY_HOST).toString()
  const client = createClient(url, `Bearer ${token}`)

  try {
    const response = await client.event.search.query({
      query: {
        type: 'and',
        clauses: [
          { status: { type: 'exact', term: 'DECLARED' }, eventType: 'death' },
          {
            data: {
              'deceased.certificateKey': {
                type: 'exact',
                term: certificateKey
              }
            }
          }
        ]
      },
      limit: 1,
      offset: 0
    })

    console.log('[DEBUG] findRecordByCertificateKey - Response:', response)

    // Handle different response formats
    const results = (response as any)?.results || []

    if (results.length === 0) {
      console.log(
        '[DEBUG] findRecordByCertificateKey - Not processed as UCCode was absent'
      ) // TODO: make sure this message is returned to the user in the UI
      return null
    }

    const record = results[0]
    console.log('[DEBUG] findRecordByCertificateKey - Found record:', record)

    return record
  } catch (error) {
    console.error('[DEBUG] findRecordByCertificateKey - Error:', error)
    throw error
  }
}

/**
 * Update a death record with IRIS output fields using the OpenCRVS API
 * Updates: irisOutput.ucCode, irisOutput.selectedCodes, irisOutput.multipleCodes, irisOutput.comment
 */
export async function updateRecordWithCauseOfDeath(
  token: string,
  eventId: string,
  row: any,
  eventDeclaration: any
): Promise<boolean> {
  const url = new URL('events', GATEWAY_HOST).toString()
  const client = createClient(url, `Bearer ${token}`)

  const decodedToken = getDecodedToken(token)

  console.log(
    '[DEBUG] updateRecordWithCauseOfDeath - decodedToken :>> ',
    decodedToken
  )

  try {
    // Step 1: Use the assignment action to update the record with IRIS output fields
    const assignmentResult =
      await client.event.actions.assignment.assign.mutate({
        type: 'ASSIGN',
        eventId,
        transactionId: uuidv4(),
        assignedTo: decodedToken?.sub || 'unknown-user',
        annotation: {}
      })

    console.log('comparing eventId :>> ', eventId)
    console.log(
      '[DEBUG] updateRecordWithCauseOfDeath - Assignment result:',
      assignmentResult
    )

    // Merge the IRIS output fields with the event declaration
    const updatedDeclaration = {
      ...eventDeclaration,
      'irisOutput.ucCode':
        row.UCCode || eventDeclaration?.['irisOutput.ucCode'] || '',
      'irisOutput.selectedCodes':
        row.SelectedCodes ||
        eventDeclaration?.['irisOutput.selectedCodes'] ||
        '',
      'irisOutput.multipleCodes':
        row.MultipleCodes ||
        eventDeclaration?.['irisOutput.multipleCodes'] ||
        '',
      'irisOutput.comment':
        row.Comments || eventDeclaration?.['irisOutput.comment'] || ''
    }

    // Step 2: Validate the updated declaration (Skipped as per tech design due to the fact that validate is now a custom action)

    // Step 3: Register the event
    const registerResult = await client.event.actions.register.request.mutate({
      declaration: updatedDeclaration,
      annotation: {},
      eventId,
      transactionId: uuidv4()
    })

    console.log(
      '[DEBUG] updateRecordWithCauseOfDeath - Register result:',
      registerResult
    )

    console.log('eventDeclaration :>>>>>>> ', eventDeclaration)
    return true
  } catch (error) {
    console.error('[DEBUG] updateRecordWithCauseOfDeath - Error:', error)
    throw error
  }
}
