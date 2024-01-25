import { v4 as uuidv4 } from 'uuid'
import { pino } from 'pino'
import PinoHttp from 'pino-http'
import { defu } from 'defu'
import type { Options as PinoHttpOptions } from 'pino-http'
import type { IncomingMessage, ServerResponse } from 'http'

const PROTECTED_REQUEST_BODY: Array<string> = ['password', 'image', 'refresh_token']

const filterSecretProperty = (
  input: Record<string, unknown> = {},
  props: Array<string> = []
): Record<string, unknown> => {
  return Object.keys(input).reduce(
    (list, x) => {
      if (props.includes(x)) list[x] = '<SECRET>'
      else list[x] = input[x]
      return list
    },
    {} as Record<string, unknown>
  )
}

const filterSecretUrl = (url: string) => {
  const regex = /(\?|&)(refresh_token|access_token|token)=([^&]+)/gm
  return url.replace(regex, '$1$2=<secret>')
}

const get_auth = (req: IncomingMessage) => {
  if (!req.headers || !req.headers.authorization) return null
  return String(req.headers.authorization).replace(/^Bearer\s(.*)$/, 'Bearer <SECRET>')
}

const defaults: PinoHttpOptions = {
  genReqId: function (req: IncomingMessage, res: ServerResponse) {
    const existingID = req.id ?? req.headers['x-request-id']
    if (existingID) return existingID
    const id = uuidv4()
    res.setHeader('X-Request-Id', id)
    return id
  },
  wrapSerializers: true,
  serializers: {
    err: pino.stdSerializers.err,
    req(req: IncomingMessage) {
      return {
        id: req.id,
        method: req.method,
        url: filterSecretUrl(req.url!),
        query: filterSecretProperty(req.query, PROTECTED_REQUEST_BODY),
        params: filterSecretProperty(req.params, PROTECTED_REQUEST_BODY),
        body: filterSecretProperty(req.raw.body, PROTECTED_REQUEST_BODY),
        authorization: get_auth(req),
        'user-agent': req.headers['user-agent'],
        origin: 'origin' in req.headers ? req.headers.origin : '',
      }
    },
    res: pino.stdSerializers.res,
  },
  customSuccessMessage: function (req: IncomingMessage, res: ServerResponse) {
    const url = 'originalUrl' in req ? req.originalUrl : req.url ?? ''
    if (res.statusCode === 404) {
      return `[${req.id}] ${req.method} ${filterSecretUrl(url as string)} resource not found`
    }
    return `[${req.id}] ${req.method} ${filterSecretUrl(url as string)} completed`
  },
  customErrorMessage: function (_req: IncomingMessage, res: ServerResponse) {
    return 'request errored with status code: ' + res.statusCode
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'timeTaken',
  },
  customProps: function (req: IncomingMessage) {
    return {
      user: 'user' in req ? req.user : undefined,
    }
  },
}

export const expressPinoLoggerMiddleware = (config: PinoHttpOptions = {}) => {
  config = defu(config, defaults)
  return PinoHttp(config)
}
