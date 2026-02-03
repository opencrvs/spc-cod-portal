import { Text } from '@mantine/core'
import { Loader2 } from 'lucide-react'

interface ProcessingScreenProps {
  current: number
  total: number
}

export function ProcessingScreen({ current, total }: ProcessingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <h2 className="text-2xl mb-3">Processing IDENT file</h2>
          <Text c="dimmed" className="text-center mb-8">
            Please wait while we process your death records...
          </Text>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Text size="sm" c="dimmed" className="text-center">
              Each record is being validated and updated with cause of death
              codes
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
