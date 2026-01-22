import { WindowConfig } from '@opencrvs/toolkit/config'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: WindowConfig
  }
}

export {}
