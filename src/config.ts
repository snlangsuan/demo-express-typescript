import path from 'path'
import * as dotenv from 'dotenv'
import { z } from 'zod'
import { ApplicationConfig, NodeEnvType } from '#types/config'
import { camelCase } from '#utils/string.utils'
import { logger } from '#utils/logger.utils'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvType).default(NodeEnvType.development),
  HOST: z.string().ip().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(3100),
  BASE_URL: z
    .string()
    .trim()
    .regex(/^https?:\/\//),
  DATABASE_URL: z
    .string()
    .trim()
    .regex(/^postgresql:\/\//),
  ACCESS_TOKEN_PRIVATE_KEY: z.string().trim(),
  ACCESS_TOKEN_PUBLIC_KEY: z.string().trim(),
  ACCESS_TOKEN_EXPIRY: z.coerce.number().int().positive(),
  REFRESH_TOKEN_PRIVATE_KEY: z.string().trim(),
  REFRESH_TOKEN_PUBLIC_KEY: z.string().trim(),
  REFRESH_TOKEN_EXPIRY: z.coerce.number().int().positive(),
  RESET_PASSWORD_EXPIRY: z.coerce.number().int().positive(),
  WHITELIST: z.preprocess(
    (val) =>
      z
        .string()
        .default('')
        .parse(val)
        .split(',')
        .map((x) => x.trim())
        .filter((x) => !!x),
    z.string().array()
  ),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  logger.error('Invalid environment variables:')
  const errors = result.error.flatten().fieldErrors
  Object.keys(errors).forEach((key) => {
    logger.error(`  ${key} is ${errors[key as keyof typeof errors]![0]}`)
  })
  process.exit(1)
}

const config = Object.keys(result.data).reduce(
  (list, key) => ({
    ...list,
    [camelCase(key)]: result.data[key as keyof typeof result.data],
  }),
  {}
) as ApplicationConfig

export default config
