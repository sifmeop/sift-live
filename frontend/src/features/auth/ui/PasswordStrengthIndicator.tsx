import { cn } from '~/shared/lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
}

const criteria = [
  { label: 'length', test: (v: string) => v.length >= 8 },
  { label: 'lowercase', test: (v: string) => /[a-z]/.test(v) },
  { label: 'uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'digit', test: (v: string) => /\d/.test(v) },
  { label: 'special', test: (v: string) => /[^A-Za-z0-9\s]/.test(v) },
]

function getScore(password: string): number {
  return criteria.reduce((acc, { test }) => acc + (test(password) ? 1 : 0), 0)
}

function getFillColor(score: number): string {
  if (score <= 1) return 'bg-destructive'
  if (score <= 2) return 'bg-orange-500'
  if (score <= 3) return 'bg-amber-500'
  if (score <= 4) return 'bg-lime-500'
  return 'bg-emerald-500'
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const score = getScore(password)
  const fillColor = getFillColor(score)

  return (
    <div className="mt-1.5 flex gap-1">
      {criteria.map(({ label }, index) => (
        <div
          key={label}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-colors duration-200',
            index < score ? fillColor : 'bg-muted',
          )}
        />
      ))}
    </div>
  )
}
