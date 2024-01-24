import { TUserRole } from '#models/user.models'
import { Request, Response, NextFunction } from 'express'

export const authorization = (role?: TUserRole) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    console.log(role)
    next()
  }
}
