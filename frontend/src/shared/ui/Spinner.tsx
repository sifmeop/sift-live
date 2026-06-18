import { LoaderCircleIcon } from 'lucide-react'

import { cn } from '~/shared/lib/utils'

interface SpinnerProps extends React.ComponentProps<'svg'> {}

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return <LoaderCircleIcon className={cn('animate-spin', className)} {...props} />
}
