import { createServer } from 'http'
import { createApplication } from '#app'
import { logger } from '#utils/logger.utils'
import config from '#config'
import type { Express } from 'express'
import type { Server } from 'http'

const app: Express = createApplication(config)

const server: Server = createServer(app)

const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') throw error
  const address = server.address()
  const bind = typeof address === 'string' ? `Pipe ${address}` : `Port ${address?.port}`

  if (error.code === 'EACCES') {
    logger.error(bind, 'requires elevated privileges')
    process.exit(1)
  }
  if (error.code === 'EADDRINUSE') {
    logger.error(bind, 'is already in use')
    process.exit(1)
  }
  throw error
}

const onListening = () => {
  const address = server.address()
  if (typeof address === 'string') return logger.info(`Express server started on pipe ${address}`)
  if (address && 'port' in address) {
    logger.info(`Express server started on port ${address.port} at ${address.address}`)
  }
}

const startServer = () => {
  server.listen(config.port, config.host)
  server.on('error', onError)
  server.on('listening', onListening)
}

if (typeof require !== 'undefined' && require.main === module) {
  startServer()
}
