import { v4 as uuidv4 } from 'uuid'
import { pino } from 'pino'
import PinoHttp from 'pino-http'
import { defu } from 'defu'
import type { Options as PinoHttpOptions } from 'pino-http'
import { Request as ExRequest } from 'express'
import type { IncomingMessage, ServerResponse } from 'http'

const PROTECTED_REQUEST_BODY: Array<string> = ['password', 'image']

const filter_secret_property = (
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
    req(req: ExRequest) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: filter_secret_property(req.body, PROTECTED_REQUEST_BODY),
        authorization: get_auth(req),
        'user-agent': req.headers['user-agent'],
        origin: 'origin' in req.headers ? req.headers.origin : '',
      }
    },
    res: pino.stdSerializers.res,
  },
  customSuccessMessage: function (req: IncomingMessage, res: ServerResponse) {
    const url = 'originalUrl' in req ? req.originalUrl : req.url
    if (res.statusCode === 404) {
      return `[${req.id}] ${req.method} ${url} resource not found`
    }
    return `[${req.id}] ${req.method} ${url} completed`
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
