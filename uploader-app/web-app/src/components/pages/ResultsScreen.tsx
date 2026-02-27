import {
  Button,
  Badge,
  Accordion,
  Text,
  Alert,
  Card,
  Group
} from '@mantine/core'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  SkipForward,
  Upload
} from 'lucide-react'
import { ProcessingSummary } from '../../util/types'

interface ResultsScreenProps {
  summary: ProcessingSummary
  onUploadNew: () => void
}

export function ResultsScreen({ summary, onUploadNew }: ResultsScreenProps) {
  const hasSkipped = summary.skipped > 0
  const hasErrors = summary.errors > 0
  const hasRejected = summary.rejected > 0

  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto p-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-4">Processing Complete</h1>
          <p className="text-gray-600">
            Your IDENT file has been processed. Review the results below.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <div className="text-center">
              <Text size="sm" c="dimmed" mb={4}>
                Total Records
              </Text>
              <Text size="xl" fw={700}>
                {summary.total}
              </Text>
            </div>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="border-green-200"
          >
            <div className="text-center">
              <Text size="sm" c="dimmed" mb={4}>
                Successful
              </Text>
              <Text size="xl" fw={700} c="green">
                {summary.successful}
              </Text>
            </div>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="border-yellow-200"
          >
            <div className="text-center">
              <Text size="sm" c="dimmed" mb={4}>
                Skipped
              </Text>
              <Text size="xl" fw={700} c="orange">
                {summary.skipped}
              </Text>
            </div>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="border-red-200"
          >
            <div className="text-center">
              <Text size="sm" c="dimmed" mb={4}>
                Rejected
              </Text>
              <Text size="xl" fw={700} c="red">
                {summary.rejected}
              </Text>
            </div>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="border-red-200"
          >
            <div className="text-center">
              <Text size="sm" c="dimmed" mb={4}>
                Errors
              </Text>
              <Text size="xl" fw={700} c="red">
                {summary.errors}
              </Text>
            </div>
          </Card>
        </div>

        {/* Success Message */}
        {summary.successful > 0 && (
          <Alert
            icon={<CheckCircle className="w-5 h-5" />}
            title="Records Updated Successfully"
            color="green"
            mb="md"
          >
            {summary.successful} record(s) were successfully updated with cause
            of death codes.
          </Alert>
        )}

        {/* Skipped Message */}
        {hasSkipped && (
          <Alert
            icon={<SkipForward className="w-5 h-5" />}
            title="Records Skipped"
            color="orange"
            mb="md"
          >
            {summary.skipped} record(s) were skipped. See details below.
          </Alert>
        )}

        {/* Errors Message */}
        {hasErrors && (
          <Alert
            icon={<AlertCircle className="w-5 h-5" />}
            title="Errors Occurred"
            color="red"
            mb="md"
          >
            {summary.errors} error(s) occurred during processing. See details
            below.
          </Alert>
        )}

        {/* Rejected Message */}
        {hasRejected && (
          <Alert
            icon={<AlertCircle className="w-5 h-5" />}
            title="Records Rejected"
            color="red"
            mb="md"
          >
            {summary.rejected} record(s) were rejected by IRIS during processing. See details
            below.
          </Alert>
        )}

        {/* Detailed Results */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
          <Text size="lg" fw={500} mb="md">
            Detailed Results
          </Text>

          <Accordion variant="contained">
            {summary.results.map((result, index) => {
              const Icon =
                result.status === 'success'
                  ? CheckCircle
                  : result.status === 'error' || result.status === 'rejected'
                    ? XCircle
                    : SkipForward

              const color =
                result.status === 'success'
                  ? 'green'
                  : result.status === 'error' || result.status === 'rejected'
                    ? 'red'
                    : 'orange'

              return (
                <Accordion.Item key={index} value={`item-${index}`}>
                  <Accordion.Control>
                    <Group gap="sm">
                      <Icon className={`w-5 h-5 text-${color}-500`} />
                      <Text>
                        Row {result.rowIndex}
                        {result.id && ` - ID: ${result.id}`}
                      </Text>
                      <Badge color={color} variant="light" ml="auto">
                        {result.status}
                      </Badge>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <div className="space-y-2">
                      <Text size="sm">
                        <strong>Status:</strong>{' '}
                        <span className={`text-${color}-600`}>
                          {result.status.charAt(0).toUpperCase() +
                            result.status.slice(1)}
                        </span>
                      </Text>
                      <Text size="sm">
                        <strong>Message:</strong> {result.message}
                      </Text>
                      {result.causesOfDeath &&
                        result.causesOfDeath.length > 0 && (
                          <Text size="sm">
                            <strong>Cause(s) of Death Added:</strong>{' '}
                            {result.causesOfDeath.join(', ')}
                          </Text>
                        )}
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Card>

        {/* Upload New Button */}
        <div className="flex justify-center">
          <Button
            leftSection={<Upload className="w-4 h-4" />}
            size="lg"
            onClick={onUploadNew}
          >
            Upload New CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
