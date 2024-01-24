import { error401 } from '#examples/error'
import { IUserAccount, IUserCredential } from '#models/user.models'
import { generateAccessToken, generateRefreshToken, getUserByCredential } from '#services/user.services'
import { EHttpStatusCode, IBaseErrorResponse } from '#types/error'
import { IBaseEmptyResponse } from '#types/response'
import { Body, Controller, Get, Post, Response, Request, Route, Security, Tags } from 'tsoa'
import { Request as ExRequest } from 'express'
import UnauthorizedError from '#errors/unauthorized.errors'

@Route('auth')
@Tags('Authentication')
class AuthController extends Controller {
  @Post('/login')
  @Response<IBaseErrorResponse>(EHttpStatusCode.UNAUTHORIZED, 'Unauthorized', {
    message: 'Please try again with the correct username and password.',
  })
  public async Login(@Request() req: ExRequest, @Body() requestBody: IUserCredential): Promise<IBaseEmptyResponse> {
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
  public async getMe(): Promise<IUserAccount> {
    return {
      id: 1,
      username: 'admin',
      role: 'admin',
      display_name: 'admin',
    }
  }

  @Post('/refresh')
  @Response<IBaseErrorResponse>(EHttpStatusCode.UNAUTHORIZED, 'Unauthorized', {
    message: 'Your request token has expired. Please obtain a new one and try again.',
  })
  public async refresh(): Promise<IBaseEmptyResponse> {
    return {}
  }
}

export default new AuthController()
