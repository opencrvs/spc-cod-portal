import { Container, Loader, Stack, Title } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../components/AppShell/AuthProvider'
import { getDecodedToken } from '../services/token'
import { EXTERNAL_CLIENT_URL } from '../util/config'

export const Route = createFileRoute('/login')({
  component: LoginComponent
})

function LoginComponent() {
  const navigate = useNavigate()
  const { setToken } = useAuth()

  useEffect(() => {
    window.parent.postMessage({ type: 'READY' }, EXTERNAL_CLIENT_URL)
    console.log('READY sent to parent')
  }, [])

  // Listen for AUTH_TOKEN
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log('event in companion', { event })
      if (event.data.type !== 'AUTH_TOKEN') {
        return
      }

      const token = event.data.token
      const decoded = getDecodedToken(token)

      if (decoded?.role !== 'CODING_OFFICER') {
        window.parent.postMessage({ type: 'FORBIDDEN' }, EXTERNAL_CLIENT_URL)
        return
      }

      localStorage.setItem('authToken', token)
      setToken(token)
      navigate({ to: '/' })
      console.log('AUTH_TOKEN received and set')
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [navigate, setToken])

  return (
    <Container>
      <Stack align="center" justify="center" mt={128}>
        <Title order={2}>Logging in</Title>
        <Loader type="dots" />
      </Stack>
    </Container>
  )
}
