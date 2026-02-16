import { GATEWAY_HOST } from '../util/constants'
import { createClient } from '@opencrvs/toolkit/api'
import { v4 as uuidv4 } from 'uuid'
import { getDecodedToken } from './token'
import { UserInfo } from '../util/types'
// import fetch from 'node-fetch'

export interface DeathRecord {
  id: string
  type: string
  status: string
  legalStatuses?: Record<string, LegalStatus>
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

export interface LegalStatus {
  createdAt: string
  createdBy: string
  createdAtLocation: string
  createdByUserType: string
  acceptedAt: string
  createdByRole: string
  registrationNumber?: string
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

    // Handle different response formats
    const results = (response as any)?.results || []

    if (results.length === 0) {
      console.log(
        '[DEBUG] findRecordByCertificateKey - Not processed as UCCode was absent'
      ) // TODO: make sure this message is returned to the user in the UI
      return null
    }

    const record = results[0]

    return record
  } catch (error) {
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

    return true
  } catch (error) {
    throw error
  }
}

/**
 * Fetch user details by user ID from OpenCRVS
 */
export async function getUserById(
  token: string,
  userId: string
): Promise<UserInfo | null> {
  const url = new URL('events', GATEWAY_HOST).toString()
  const client = createClient(url, `Bearer ${token}`)

  try {
    const response = await client.user.get.query(userId)

    if (!response) {
      return null
    }

    const user = await response

    return {
      id: user.id || userId,
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User'
      // email: user.email || '',
      // firstName: user.name?.[0]?.given?.[0] || '',
      // lastName: user.name?.[0]?.family || ''
    }
  } catch (error) {
    return null
  }
}

/**
 * Extract the createdBy user ID from the DECLARED legal status
 */
export function getCreatedByFromLegalStatuses(
  legalStatuses?: Record<string, LegalStatus>
): string | null {
  if (!legalStatuses) {
    return null
  }

  const declaredStatus = legalStatuses['DECLARED']
  if (declaredStatus?.createdBy) {
    return declaredStatus.createdBy
  }

  return null
}

/**
 * Send email notification to a user about processed records
 */
export async function sendProcessingNotificationEmail(
  token: string,
  userInfo: UserInfo,
  recordIds: string[]
): Promise<boolean> {
  const url = new URL('email', GATEWAY_HOST).toString()

  const loginUrl = 'https://login.spc-cod.opencrvs.org'

  const emailContent = `
    <p>Dear ${userInfo.firstName} ${userInfo.lastName},</p>
    <p>The following records have been encoded with cause of death codes and are ready to view:</p>
    <ul>
      ${recordIds.map((id) => `<li>${id}</li>`).join('')}
    </ul>
    <p>Login to <a href="${loginUrl}">${loginUrl}</a> in order to access.</p>
    <p>SPC Regional Coding Group</p>
  `

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: 'Death Records Processed - Cause of Death Codes Updated',
        html: emailContent,
        from: 'noreply@opencrvs.org',
        to: userInfo.email
      })
    })

    if (!response.ok) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}
