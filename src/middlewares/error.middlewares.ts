import ApplicationError from '#errors/application.errors'
import HttpError from '#errors/http.errors'
import ObjectNotFoundError from '#errors/object.not.found.errors'
import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => next(new ObjectNotFoundError())

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.log(res.log)
  // res.log.error(error)
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json(error.toJSON)
  }

  const newError = new ApplicationError()
  return res.status(newError.statusCode).json(newError)
}
