import { LoaderCircleIcon } from 'lucide-react'

import { cn } from '~/shared/lib/utils'

interface SpinnerProps extends React.ComponentProps<'svg'> {
  variant?: 'default' | 'inline' | 'full-absolute' | 'full-fixed'
}

export const Spinner = ({ className, variant = 'default', ...props }: SpinnerProps) => {
  const loader = (
    <LoaderCircleIcon
      className={cn(
        'animate-spin',
        {
          'w-full': variant === 'inline',
        },
        className,
      )}
      {...props}
    />
  )

  if (variant === 'full-absolute') {
    return (
      <div className="bg-background z-px absolute inset-0 flex items-center justify-center">
        {loader}
      </div>
    )
  }

  if (variant === 'full-fixed') {
    return (
      <div className="bg-background fixed inset-0 z-10 flex h-dvh items-center justify-center">
        {loader}
      </div>
    )
  }

  return loader
}
