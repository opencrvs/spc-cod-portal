// Mock OpenCRVS database, to be removed when integrating with the real API

import { ProcessingSummary } from './types'

interface DeathRecord {
  id: string
  deceased: string
  causeOfDeath: string[]
  dateOfDeath: string
}

// Mock database with some sample records
const mockDatabase: Map<string, DeathRecord> = new Map([
  [
    'DR001',
    {
      id: 'DR001',
      deceased: 'John Doe',
      causeOfDeath: [],
      dateOfDeath: '2024-01-15'
    }
  ],
  [
    'DR002',
    {
      id: 'DR002',
      deceased: 'Jane Smith',
      causeOfDeath: [],
      dateOfDeath: '2024-02-20'
    }
  ],
  [
    'DR003',
    {
      id: 'DR003',
      deceased: 'Bob Johnson',
      causeOfDeath: [],
      dateOfDeath: '2024-03-10'
    }
  ],
  [
    'DR005',
    {
      id: 'DR005',
      deceased: 'Alice Brown',
      causeOfDeath: [],
      dateOfDeath: '2024-04-05'
    }
  ],
  [
    'DR007',
    {
      id: 'DR007',
      deceased: 'Charlie Wilson',
      causeOfDeath: [],
      dateOfDeath: '2024-05-12'
    }
  ]
])

// Mock data for testing
const getMockSummary = (): ProcessingSummary => ({
  total: 5,
  successful: 3,
  skipped: 1,
  errors: 1,
  results: [
    {
      rowIndex: 1,
      id: 'TEST001',
      status: 'success',
      message: 'Successfully updated',
      causesOfDeath: ['I21.9', 'E11.9']
    },
    {
      rowIndex: 2,
      id: 'TEST002',
      status: 'success',
      message: 'Successfully updated',
      causesOfDeath: ['J18.9']
    },
    {
      rowIndex: 3,
      id: 'TEST003',
      status: 'skipped',
      message: 'No cause of death codes found'
    },
    {
      rowIndex: 4,
      id: 'TEST004',
      status: 'success',
      message: 'Successfully updated',
      causesOfDeath: ['I25.1', 'I10']
    },
    {
      rowIndex: 5,
      id: 'TEST005',
      status: 'error',
      message: 'Record not found in database'
    }
  ]
})

export const findRecordById = async (
  id: string
): Promise<DeathRecord | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockDatabase.get(id) || null
}

export const updateCauseOfDeath = async (
  id: string,
  causesOfDeath: string[]
): Promise<boolean> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const record = mockDatabase.get(id)
  if (!record) {
    return false
  }

  // Update the record
  record.causeOfDeath = [...new Set([...record.causeOfDeath, ...causesOfDeath])]
  return true
}
