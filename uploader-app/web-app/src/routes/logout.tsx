import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../components/AppShell/AuthProvider'
import { Center, Paper, Title, Text, Loader, Stack } from '@mantine/core'

export const Route = createFileRoute('/logout')({
  component: Logout
})

export function Logout() {
  const { performLogout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    performLogout()
    navigate({ to: '/' })
  }, [performLogout, navigate])

  return (
    <Center style={{ height: 'calc(100vh - 120px)' }}>
      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        withBorder
        style={{ maxWidth: 400, width: '100%' }}
      >
        <Stack align="center" gap="md">
          <Loader size="md" />
          <Title order={2}>Logging Out</Title>
          <Text c="dimmed" ta="center">
            Please wait while we securely log you out of your account.
          </Text>
        </Stack>
      </Paper>
    </Center>
  )
}
