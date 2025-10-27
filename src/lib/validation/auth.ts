import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const selectAccountSchema = z.object({
  account_id: z.number().min(1, 'Account selection is required'),
})

export const impersonationSchema = z.object({
  user_id: z.number().min(1, 'User selection is required'),
  reason: z.string().min(1, 'Reason is required'),
})

export type LoginData = z.infer<typeof loginSchema>
export type SelectAccountData = z.infer<typeof selectAccountSchema>
export type ImpersonationData = z.infer<typeof impersonationSchema>
