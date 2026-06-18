import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlertIcon, LockIcon, MailIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
import { useMutation } from 'urql'

import { LOGIN_MUTATION } from '~/features/auth/api/login'
import type { LoginSchema } from '~/features/auth/model/login.schema'
import { useLoginSchema } from '~/features/auth/model/useLoginSchema'
import { useAuthStore } from '~/shared/auth'
import { Alert, AlertDescription } from '~/shared/ui/Alert'
import { Button } from '~/shared/ui/Button'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/shared/ui/Field'
import { Input } from '~/shared/ui/Input'
import { PasswordInput } from '~/shared/ui/PasswordInput'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const login = useAuthStore((s) => s.login)
  const t = useIntlayer('login-form')
  const loginSchema = useLoginSchema()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const [{ fetching, error }, executeLogin] = useMutation(LOGIN_MUTATION)

  const submit = async (data: LoginSchema) => {
    const result = await executeLogin({ input: data })

    if (result.data?.login) {
      login(result.data.login)
      onSuccess?.()
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">{t.welcomeBack}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t.signInToContinue}</p>
      </div>

      {error?.graphQLErrors?.[0] && (
        <Alert variant="destructive" className="mb-4">
          <CircleAlertIcon />
          <AlertDescription>{error.graphQLErrors[0].message}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">{t.email}</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            startIcon={<MailIcon />}
            placeholder={t.emailPlaceholder.value}
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">{t.password}</FieldLabel>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            startIcon={<LockIcon />}
            placeholder={t.passwordPlaceholder.value}
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>

      <Button type="submit" isLoading={fetching} className="mt-4 w-full">
        {t.signInButton}
      </Button>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        {t.noAccount}{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary cursor-pointer font-medium underline-offset-2 hover:underline"
        >
          {t.signUpLink}
        </button>
      </p>
    </form>
  )
}
