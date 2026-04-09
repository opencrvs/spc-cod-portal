import { Center, MantineProvider } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import '../styles/mantine.css'
import { UploadScreen } from '../components/pages/UploadScreen'
import { ProcessingScreen } from '../components/pages/ProcessingScreen'
import { ResultsScreen } from '../components/pages/ResultsScreen'
import { ProcessingSummary } from '../util/types'
import { parseCSV, processCSV } from '../util/csvProccessor'

type AppState = 'upload' | 'processing' | 'results' | 'error'

export const Route = createFileRoute('/')({
  component: HomeComponent
})

function HomeComponent() {
  const [state, setState] = useState<AppState>('upload')
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    currentCertificateKey: ''
  })
  const [summary, setSummary] = useState<ProcessingSummary | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationError, setValidationError] = useState<string>('')

  const handleFileSelect = async (file: File) => {
    
    try {
      setValidationError('')
      setState('processing')
      setErrorMessage('')

      // Get the authentication token
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Authentication token not found. Please log in.')
      }

      // Parse the CSV file
      const rows = await parseCSV(file)

      if (rows.length === 0) {
        throw new Error('CSV file is empty')
      }

      setProgress({ current: 0, total: rows.length, currentCertificateKey: '' })

      // Process the CSV rows with the backend
      const result = await processCSV(rows, token, (current, total, currentCertificateKey
      ) => {
        setProgress({ current, total, currentCertificateKey })
      })

      setSummary(result)
      setState('results')
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'An unknown error occurred'

      // Check if it's a validation error (missing headers)
      if (errorMsg.includes('Missing required headers')) {
        setValidationError(errorMsg)
        setState('upload')
      } else {
        setState('error')
        setErrorMessage(errorMsg)
      }
    }
  }

  const handleUploadNew = () => {
    setState('upload')
    setProgress({ current: 0, total: 0, currentCertificateKey: '' })
    setSummary(null)
    setErrorMessage('')
    setValidationError('')
  }

  return (
    <Center>
      <MantineProvider>
        <div className="max-h-full bg-white">
          {state === 'upload' && (
            <UploadScreen
              onFileSelect={handleFileSelect}
              validationError={validationError}
            />
          )}

          {state === 'processing' && (
            <ProcessingScreen
              currentProgress={progress}
            />
          )}

          {state === 'results' && summary && (
            <ResultsScreen summary={summary} onUploadNew={handleUploadNew} />
          )}

          {state === 'error' && (
            <div className="flex flex-col items-center justify-center min-h-screen p-8">
              <div className="w-full max-w-md">
                <div className="p-8 bg-red-50 border-2 border-red-300 rounded-lg">
                  <h2 className="text-2xl text-red-800 mb-4">Error</h2>
                  <p className="text-red-700 mb-6">{errorMessage}</p>
                  <button
                    onClick={handleUploadNew}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </MantineProvider>
    </Center>
  )
}
