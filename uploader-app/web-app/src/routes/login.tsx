import { Container, Loader, Stack, Title } from '@mantine/core'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../components/AppShell/AuthProvider'
import { getDecodedToken } from '../services/token'
import { EXTERNAL_LOGIN_URL } from '../util/config'

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
  const token = search.token
  const decodedToken = token ? getDecodedToken(token) : null

  useEffect(() => {
    if (token && decodedToken?.role === 'CODING_OFFICER') {
      localStorage.setItem('authToken', token)
      setToken(token)
      navigate({ to: '/' })
    } else {
      // Only redirect if token is missing or role is wrong
      window.location.href = EXTERNAL_LOGIN_URL
    }
  }, [navigate, decodedToken, setToken, token])

  return (
    <Container>
      <Stack align="center" justify="center" mt={128}>
        <Title order={2}>Logging in</Title>
        <Loader type="dots" />
      </Stack>
    </Container>
  )
}
