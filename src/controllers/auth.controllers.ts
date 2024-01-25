import { error401 } from '#examples/error'
import { IUserAccount, IUserCredential, IUserCredentialResponse } from '#models/user.models'
import { generateAccessToken, generateRefreshToken, getUserByCredential, verifyToken } from '#services/user.services'
import { EHttpStatusCode, IBaseErrorResponse } from '#types/error'
import { IBaseEmptyResponse } from '#types/response'
import { Body, Get, Post, Response, Request, Route, Security, Tags, Query } from 'tsoa'
import { Request as ExRequest } from 'express'
import UnauthorizedError from '#errors/unauthorized.errors'

@Route('auth')
@Tags('Authentication')
export default class AuthController {
  @Post('/login')
  @Response<IBaseErrorResponse>(EHttpStatusCode.UNAUTHORIZED, 'Unauthorized', {
    message: 'Please try again with the correct username and password.',
  })
  public async Login(
    @Request() req: ExRequest,
    @Body() requestBody: IUserCredential
  ): Promise<IUserCredentialResponse> {
    const { username, password } = requestBody
    const user = getUserByCredential(username, password)
    if (!user) throw new UnauthorizedError('Please try again with the correct username and password.')
    const accessToken = generateAccessToken(
      user.id!,
      req.app.get('accessTokenPrivateKey'),
      req.app.get('accessTokenExpiry')
    )
    const refreshToken = generateRefreshToken(
      user.id!,
      req.app.get('refreshTokenPrivateKey'),
      req.app.get('refreshTokenExpiry')
    )
    return {
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
      expired: accessToken.exp,
    }
  }

  @Get('/me')
  @Security('bearerAuth')
  @Response<IBaseErrorResponse>(EHttpStatusCode.UNAUTHORIZED, 'Unauthorized', error401)
  public async getMe(@Request() req: ExRequest): Promise<IUserAccount> {
    return req.user!
  }

  @Post('/refresh')
  @Security('bearerAuth')
  @Response<IBaseErrorResponse>(EHttpStatusCode.UNAUTHORIZED, 'Unauthorized', {
    message: 'Your request token has expired. Please obtain a new one and try again.',
  })
  public async refresh(@Request() req: ExRequest, @Query() refresh_token: string): Promise<IBaseEmptyResponse> {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const accessToken = req.headers.authorization.replace('Bearer ', '')
      const accessTokenResult = verifyToken(accessToken, req.app.get('accessTokenPublicKey'), true)
      const refreshTokenResult = verifyToken(refresh_token, req.app.get('refreshTokenPublicKey'))

      if (accessTokenResult && refreshTokenResult) {
        const accessToken = generateAccessToken(
          accessTokenResult.uid,
          req.app.get('accessTokenPrivateKey'),
          req.app.get('accessTokenExpiry')
        )
        const refreshToken = generateRefreshToken(
          accessTokenResult.uid,
          req.app.get('refreshTokenPrivateKey'),
          req.app.get('refreshTokenExpiry')
        )
        return {
          access_token: accessToken.token,
          refresh_token: refreshToken.token,
          expired: accessToken.exp,
        }
      }
    }
    throw new UnauthorizedError()
  }
}
