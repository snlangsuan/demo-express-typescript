import { IUserAccount } from '#models/user.models'
import JWT from 'jsonwebtoken'
import dayjs from 'dayjs'
import InvalidParameterError from '#errors/invalid.parameter.errors'
import ApplicationError from '#errors/application.errors'

const USER_INDEXIS = {
  'admin:admin': 0,
}

const USERS: Array<IUserAccount> = [
  {
    id: 1,
    username: 'admin',
    display_name: 'admin',
    role: 'admin',
  },
]

interface IGenerateTokenPayload extends JWT.JwtPayload {
  uid: number
  iat: number
}

interface IGenerateToken {
  token: string
  iat: number
  exp: number
}

export const generateAccessToken = (uid: number, secret: string, expiry: number): IGenerateToken => {
  const iat = dayjs().unix()
  const expired = dayjs.unix(iat).add(expiry, 'seconds').unix()
  const payload: IGenerateTokenPayload = {
    uid,
    iat,
  }
  const options: JWT.SignOptions = {
    algorithm: 'RS256',
    expiresIn: expiry,
  }
  const token = JWT.sign(payload, secret, options)
  return {
    token,
    iat,
    exp: expired,
  }
}

export const generateRefreshToken = (uid: number, secret: string, expiry: number): IGenerateToken => {
  const iat = dayjs().unix()
  const expired = dayjs.unix(iat).add(expiry, 'seconds').unix()
  const payload: JWT.JwtPayload = {
    uid,
    iat,
  }
  const options: JWT.SignOptions = {
    algorithm: 'RS256',
    expiresIn: expiry,
    allowInsecureKeySizes: true,
  }
  const token = JWT.sign(payload, secret, options)
  return {
    token,
    iat,
    exp: expired,
  }
}

export const verifyToken = (token: string, secret: string, ignoreExpire: boolean = false): IGenerateTokenPayload => {
  try {
    const options: JWT.VerifyOptions = {
      algorithms: ['RS256'],
      ignoreExpiration: ignoreExpire,
    }
    const result = JWT.verify(token, secret, options)
    return result as IGenerateTokenPayload
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) throw new InvalidParameterError('The token is expired.')
    if (error instanceof JWT.JsonWebTokenError) throw new InvalidParameterError('The token is invalid.')
    throw new ApplicationError()
  }
}

export const getUserByCredential = (username: string, password: string): IUserAccount | void => {
  const idx = USER_INDEXIS[`${username}:${password}` as keyof typeof USER_INDEXIS]
  if (typeof idx !== 'number') return
  const user = USERS[idx]
  if (user) return user
}

export const getUserById = (id: number): IUserAccount | void => {
  const user = USERS.find((user) => user.id === id)
  if (user) return user
}
