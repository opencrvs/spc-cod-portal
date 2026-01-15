import { Container, Loader, Stack, Title } from '@mantine/core'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../components/AppShell/AuthProvider'

type LoginSearchProps = {
  token?: string
}

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  validateSearch: (search: Record<string, unknown>): LoginSearchProps => {
    return {
      token: search.token as string
    }
  }
})

function LoginComponent() {
  const search = useSearch({
    from: '/login'
  })
  const navigate = useNavigate()
  const { setToken } = useAuth()

  useEffect(() => {
    const token = search.token
    if (token) {
      localStorage.setItem('authToken', token)
      setToken(token)
      navigate({ to: '/' })
    }
  }, [search, navigate])

  return (
    <Container>
      <Stack align="center" justify="center" mt={128}>
        <Title order={2}>Logging in</Title>
        <Loader type="dots" />
      </Stack>
    </Container>
  )
}
