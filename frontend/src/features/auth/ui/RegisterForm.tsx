import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlertIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
import { useMutation } from 'urql'

import { REGISTER_MUTATION } from '~/features/auth/api/register'
import type { RegisterSchema } from '~/features/auth/model/register.schema'
import { useRegisterSchema } from '~/features/auth/model/useRegisterSchema'
import { PasswordStrengthIndicator } from '~/features/auth/ui/PasswordStrengthIndicator'
import { useAuthStore } from '~/shared/auth'
import { Alert, AlertDescription } from '~/shared/ui/Alert'
import { Button } from '~/shared/ui/Button'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/shared/ui/Field'
import { Input } from '~/shared/ui/Input'
import { PasswordInput } from '~/shared/ui/PasswordInput'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const login = useAuthStore((s) => s.login)
  const t = useIntlayer('register-form')
  const registerSchema = useRegisterSchema()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const [{ fetching, error }, executeRegister] = useMutation(REGISTER_MUTATION)

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  })

  const submit = async (data: RegisterSchema) => {
    const result = await executeRegister({ input: data })

    if (result.data?.register) {
      login(result.data.register)
      onSuccess?.()
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">{t.createAccount}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t.joinCommunity}</p>
      </div>

      {error?.graphQLErrors?.[0] && (
        <Alert variant="destructive" className="mb-4">
          <CircleAlertIcon />
          <AlertDescription>{error.graphQLErrors[0].message}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="register-email">{t.email}</FieldLabel>
          <Input
            id="register-email"
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
          <FieldLabel htmlFor="register-username">{t.username}</FieldLabel>
          <Input
            id="register-username"
            autoComplete="username"
            startIcon={<UserIcon />}
            placeholder={t.usernamePlaceholder.value}
            {...register('username')}
            aria-invalid={!!errors.username}
          />
          <FieldError errors={[errors.username]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="register-password">{t.password}</FieldLabel>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            startIcon={<LockIcon />}
            placeholder={t.passwordPlaceholder.value}
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          <PasswordStrengthIndicator password={passwordValue} />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>

      <Button type="submit" isLoading={fetching} className="mt-4 w-full">
        {t.createAccountButton}
      </Button>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        {t.alreadyHaveAccount}{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary cursor-pointer font-medium underline-offset-2 hover:underline"
        >
          {t.signInLink}
        </button>
      </p>
    </form>
  )
}
