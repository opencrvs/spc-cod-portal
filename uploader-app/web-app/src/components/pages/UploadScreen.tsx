import { Group, Text, rem, Alert } from '@mantine/core'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'

interface UploadScreenProps {
  onFileSelect: (file: File) => void
  validationError?: string
}

export function UploadScreen({
  onFileSelect,
  validationError
}: UploadScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-4">OpenCRVS Iris IDENT Uploader</h1>
          <p className="text-gray-600">
            Upload an Iris IDENT file to process death records and update cause
            of death codes
          </p>
        </div>

        <Dropzone
          onDrop={(files: FileWithPath[]) => {
            if (files[0]) {
              onFileSelect(files[0])
            }
          }}
          onReject={(files) => {
            console.error('File rejected:', files)
          }}
          maxSize={5 * 1024 ** 2}
          accept={{
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
          }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <Upload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)'
                }}
                strokeWidth={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <X
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)'
                }}
                strokeWidth={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <FileText
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-gray-6)'
                }}
                strokeWidth={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline className="text-center">
                Drag an Iris IDENT file with UCCodes here or click to select
              </Text>
              <Text
                size="sm"
                c="dimmed"
                inline
                mt={7}
                className="text-center block"
              >
                File should not exceed 5MB and must be in CSV format
              </Text>
            </div>
          </Group>
        </Dropzone>

        {validationError && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="File Validation Error"
            color="red"
            className="mt-4"
          >
            {validationError}
          </Alert>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-900">
            CSV Format Requirements:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Must contain the following required columns:</li>
            <li className="ml-4">
              - <strong>CertificateKey</strong>: Death record identifier
            </li>
            <li className="ml-4">
              - <strong>UCCode</strong>: Underlying cause of death code
            </li>
            <li className="ml-4">
              - <strong>SelectedCodes</strong>: Additional selected cause codes
            </li>
            <li className="ml-4">
              - <strong>MultipleCodes</strong>: Multiple cause codes (if
              applicable)
            </li>
            <li className="ml-4">
              - <strong>Status</strong>: Final or Rejected
            </li>
            <li>
              • Codes in SelectedCodes and MultipleCodes can be comma or
              semicolon separated
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
