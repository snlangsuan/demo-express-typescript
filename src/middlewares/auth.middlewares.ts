import InsufficientPermissionError from '#errors/insufficient.permission.errors'
import UnauthorizedError from '#errors/unauthorized.errors'
import { TUserRole } from '#models/user.models'
import { getUserById, verifyToken } from '#services/user.services'
import { Request, Response, NextFunction } from 'express'

export const authorization = (role?: TUserRole) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.replace('Bearer ', '')
      try {
        const result = verifyToken(token, req.app.get('accessTokenPublicKey'))
        const user = getUserById(result.uid)
        if (role && user?.role !== role)
          throw new InsufficientPermissionError('Permission error: User lacks necessary access.')
        req.user = user!
        next()
      } catch (error) {
        next(error)
      }
    }
    next(new UnauthorizedError())
  }
}
