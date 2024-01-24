import { IUserAccount } from '#models/user.models'
import JWT from 'jsonwebtoken'
import dayjs from 'dayjs'

interface IGenerateToken {
  token: string
  iat: number
  exp: number
}

export const generateAccessToken = (uid: number, secret: string, expiry: number): IGenerateToken => {
  const iat = dayjs().unix()
  const expired = dayjs.unix(iat).add(expiry, 'seconds').unix()
  const payload: JWT.JwtPayload = {
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

export const getUserByCredential = (username: string, password: string): IUserAccount | void => {
  if (username === 'admin' && password === 'admin') {
    return {
      id: 1,
      username: 'admin',
      display_name: 'admin',
      role: 'admin',
    }
  }
}
