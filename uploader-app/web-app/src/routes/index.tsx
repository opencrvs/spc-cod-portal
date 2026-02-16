import { Center, Stack, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent
})

function HomeComponent() {
  return (
    <Center>
      <Stack mt={64} gap={128} align="center">
        <Title>Welcome to the SPC COD Portal Uploader App</Title>
      </Stack>
    </Center>
  )
}
