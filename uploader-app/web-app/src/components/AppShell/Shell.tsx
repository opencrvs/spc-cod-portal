import {
  AppShell,
  Burger,
  Container,
  Group,
  NavLink,
  Stack,
  Button,
  Modal,
  FileInput,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUser } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle'
import { useAuth } from './AuthProvider'
import { QueryErrorBoundary } from './QueryErrorBoundary'

export function Shell({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure()
  const { isLoggedIn, role } = useAuth()
  const [openedModal, { open, close }] = useDisclosure(false)

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
                <Button
                  variant="subtle"
                  onClick={open}
                  style={{ fontWeight: 'bold' }}
                >
                  Upload
                </Button>
                <Modal
                  opened={openedModal}
                  onClose={close}
                  title="Upload Excel File"
                  centered
                >
                  <FileInput
                    label="Excel file"
                    placeholder="Choose .xlsx or .xls file"
                    accept=".xlsx,.xls"
                    onChange={(file) => {
                      // TODO : Handle file upload
                      console.log(file)
                    }}
                  />
                </Modal>
              </>
            )}
          </div>
          <div
            style={{
              borderTop: '2px solid var( --app-shell-border-color)'
            }}
          ></div>
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
