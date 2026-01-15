import {
  Button,
  Center,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { EXTERNAL_LOGIN_URL_WITH_REDIRECT } from '../util/config'

export const Route = createFileRoute('/tokenExpired')({
  component: RouteComponent
})

function RouteComponent() {
  const theme = useMantineTheme()

  return (
    <Center style={{ height: '100vh' }}>
      <Paper shadow="md" radius="lg" p="xl" withBorder>
        <Stack align="center" gap="md">
          <Title order={2} c={theme.colors.red[4]}>
            Session Expired
          </Title>
          <Text c={theme.colors.dark[2]}>
            Your session has expired. Please log in again to continue.
          </Text>
          <Button
            component={Link}
            size="md"
            to={EXTERNAL_LOGIN_URL_WITH_REDIRECT}
          >
            Log in
          </Button>
        </Stack>
      </Paper>
    </Center>
  )
}
