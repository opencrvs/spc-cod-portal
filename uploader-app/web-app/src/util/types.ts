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
}

export interface ProcessingSummary {
  total: number
  successful: number
  skipped: number
  errors: number
  results: ProcessingResult[]
}
