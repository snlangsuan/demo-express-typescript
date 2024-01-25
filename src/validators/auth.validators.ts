import { z } from 'zod'
export const refreshTokenValidator = z.object({
  query: z.object({
    refresh_token: z.string({ required_error: 'The refresh_token is required.' }),
  }),
})
