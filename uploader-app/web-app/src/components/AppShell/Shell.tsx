import {
  AppShell,
  Burger,
  Container,
  Group,
  NavLink,
  Stack,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDoor, IconUser } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { EXTERNAL_LOGIN_URL_WITH_REDIRECT } from '../../util/config'
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle'
import { useAuth } from './AuthProvider'
import { QueryErrorBoundary } from './QueryErrorBoundary'

export function Shell({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure()
  const { isLoggedIn, role } = useAuth()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group>
            <Title>SPC Uploader App</Title>
          </Group>
          <Group>
            {isLoggedIn && role && (
              <>
                <IconUser />
                <Title order={4}>{role}</Title>
              </>
            )}
            <ColorSchemeToggle />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack justify="space-between" style={{ height: '100%' }}>
          <div>
            <NavLink
              component={Link}
              to="/"
              label="Home"
              activeOptions={{ exact: true }}
              style={{ fontWeight: 'bold' }}
            />
            {isLoggedIn && (
              <>
                <NavLink
                  component={Link}
                  to="/capture"
                  label="Capture"
                  style={{ fontWeight: 'bold' }}
                />
                <NavLink
                  component={Link}
                  to="/view"
                  label="View Records"
                  style={{ fontWeight: 'bold' }}
                />
              </>
            )}
          </div>
          <div
            style={{
              borderTop: '2px solid var( --app-shell-border-color)'
            }}
          >
            {isLoggedIn ? (
              <NavLink
                component={Link}
                to="/logout"
                key={'logout'}
                label={
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Title order={6} fw="lighter">
                        {role}
                      </Title>
                      <Title order={5}>Logout</Title>
                    </Stack>
                    <IconDoor />
                  </Group>
                }
              />
            ) : (
              <NavLink
                href={EXTERNAL_LOGIN_URL_WITH_REDIRECT}
                key={'login'}
                label="Login"
                style={{
                  fontWeight: 'bold'
                }}
              />
            )}
          </div>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <QueryErrorBoundary>
          <Container>{children}</Container>
        </QueryErrorBoundary>
      </AppShell.Main>
    </AppShell>
  )
}
