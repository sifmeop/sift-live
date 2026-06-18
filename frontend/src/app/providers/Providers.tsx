import { IntlayerProvider } from 'react-intlayer'

import { useInitAuth } from '~/shared/auth'

import { TanstackRouter } from './TanstackRouter'
import { ThemeProvider } from './ThemeProvider'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  useInitAuth()

  return (
    <UrqlProvider>
      <IntlayerProvider>
        <ThemeProvider>
          <TanstackRouter />
        </ThemeProvider>
      </IntlayerProvider>
    </UrqlProvider>
  )
}
