import {
  LogInIcon,
  LogOutIcon,
  MoonIcon,
  TvIcon,
  UserRoundIcon,
  UserRoundXIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useIntlayer, useLocale } from 'react-intlayer'

import { useTheme } from '~/app/providers/ThemeProvider'
import { LoginForm, RegisterForm } from '~/features/auth'
import { useAuthStore, useLogout } from '~/shared/auth'
import { Button } from '~/shared/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '~/shared/ui/Dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/ui/DropdownMenu'
import { Spinner } from '~/shared/ui/Spinner'

export const Header = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const logout = useLogout()
  const { isDark, setTheme } = useTheme()
  const t = useIntlayer('header')
  const { locale, setLocale } = useLocale()

  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        <TvIcon className="text-primary size-6" />

        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
          <DialogTitle className="sr-only">{t.signInDialogTitle}</DialogTitle>
          <DialogContent>
            <LoginForm
              onSuccess={() => setLoginOpen(false)}
              onSwitchToRegister={() => {
                setLoginOpen(false)
                setRegisterOpen(true)
              }}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
          <DialogTitle className="sr-only">{t.createAccountDialogTitle}</DialogTitle>
          <DialogContent>
            <RegisterForm
              onSuccess={() => setRegisterOpen(false)}
              onSwitchToLogin={() => {
                setRegisterOpen(false)
                setLoginOpen(true)
              }}
            />
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="secondary" size="icon" disabled={isLoading} />}
          >
            {isLoading ? (
              <Spinner className="size-[60%]" />
            ) : isAuthenticated ? (
              <UserRoundIcon />
            ) : (
              <UserRoundXIcon />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t.languageLabel}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
                <DropdownMenuRadioItem value="en">
                  <img className="h-auto w-4 rounded-xs" src="/assets/flags/us.svg" alt="English" />
                  English
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="uk">
                  <img
                    className="h-auto w-4 rounded-xs"
                    src="/assets/flags/ua.svg"
                    alt="Українська"
                  />
                  Українська
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ru">
                  <img className="h-auto w-4 rounded-xs" src="/assets/flags/ru.svg" alt="Русский" />
                  Русский
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>{t.themeLabel}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              >
                <MoonIcon />
                {t.darkMode}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              {isAuthenticated ? (
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon />
                  {t.signOut}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setLoginOpen(true)}>
                  <LogInIcon />
                  {t.signIn}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
