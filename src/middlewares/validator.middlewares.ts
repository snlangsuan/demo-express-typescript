import InvalidParameterError from '#errors/invalid.parameter.errors'
import { parseValidateErrorDetails } from '#utils/logger.utils'
import { Request as ExRequest, Response as ExResponse, NextFunction } from 'express'
import type { AnyZodObject } from 'zod'
export const validateParameter = (validator: AnyZodObject) => {
  return (req: ExRequest, res: ExResponse, next: NextFunction) => {
    try {
      const params = { query: req.query, params: req.params, body: req.body }
      const result = validator.safeParse(params)
      if (!result.success) {
        const details = parseValidateErrorDetails(result.error)
        const method = details[0].property.split('.')[0]
        const error = new InvalidParameterError(`The request ${method} has ${details.length} error(s)`, details)
        res.status(error.statusCode).json(error.toJSON())
      } else {
        req.query = result.data.query ?? {}
        req.body = result.data.body ?? {}
        req.params = result.data.params ?? {}
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
