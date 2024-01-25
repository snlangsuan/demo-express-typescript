import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import { NodeEnvType } from '#types/config'
import type { ApplicationConfig } from '#types/config'
import type { CorsOptions } from 'cors'
import { expressPinoLoggerMiddleware } from '#middlewares/logger.middlewares'
import { logger } from '#utils/logger.utils'
import route from '#routes'
import { errorHandler, notFoundHandler } from '#middlewares/error.middlewares'
import type { Express } from 'express'
import * as swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from '../public/swagger.json'

export function createApplication(config: ApplicationConfig): Express {
  const app = express()

  Object.keys(config).forEach((key) => {
    app.set(key, config[key as keyof typeof config])
  })

  const corsOptions: CorsOptions = {
    optionsSuccessStatus: 200,
    origin: config.whitelist,
  }
  app.use(cors(corsOptions))
  app.use(
    express.urlencoded({
      extended: true,
      limit: '25mb',
    })
  )
  app.use(
    express.json({
      limit: '25mb',
    })
  )
  app.use(helmet())
  app.use(
    expressPinoLoggerMiddleware({
      logger: logger,
      autoLogging: true,
    })
  )

  app.use(express.static(path.join(process.cwd(), 'public'), { maxAge: '1d' }))

  if (app.get('nodeEnv') === NodeEnvType.development) {
    app.use(['/openapi', '/docs', '/swagger'], swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  }
  app.use('/', route)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
