import { Transform } from 'class-transformer'

export const Trim = () => Transform(({ value }) => (value as string).trim())

export const ToLower = () => Transform(({ value }) => (value as string).toLowerCase())
