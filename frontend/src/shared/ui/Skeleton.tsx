import * as React from 'react'

import { cn } from '~/shared/lib/utils'

export const Skeleton = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    data-slot="skeleton"
    className={cn('animate-pulse rounded-md bg-muted grid place-items-center', className)}
    {...props}
  />
)
