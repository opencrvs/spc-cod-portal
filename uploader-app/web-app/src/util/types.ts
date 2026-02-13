export type Role = 'Regional Coding Officer'

export interface CSVRow {
  id: string
  [key: string]: string
}

export interface ProcessingResult {
  rowIndex: number
  id: string
  status: 'success' | 'skipped' | 'error'
  message: string
  causesOfDeath?: string[]
  /** The user ID who created the record (from legalStatuses.DECLARED.createdBy) */
  createdBy?: string
  /** The tracking ID of the record for display in emails */
  trackingId?: string
}

export interface ProcessingSummary {
  total: number
  successful: number
  skipped: number
  errors: number
  results: ProcessingResult[]
}

/**
 * User information for email notifications
 */
export interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
}

/**
 * Grouped records by user for email notifications
 */
export interface UserRecords {
  user: UserInfo
  recordIds: string[]
}
