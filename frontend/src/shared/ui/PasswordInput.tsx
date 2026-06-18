import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

import { Input } from '~/shared/ui/Input'

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, 'type' | 'endIcon'> {}

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
  const [show, setShow] = useState(false)

  return (
    <Input
      type={show ? 'text' : 'password'}
      endIcon={
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground pointer-events-auto inline-flex cursor-pointer items-center"
          tabIndex={-1}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...props}
    />
  )
}
