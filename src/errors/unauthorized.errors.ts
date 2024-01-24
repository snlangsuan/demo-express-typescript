import { EHttpStatusCode, IBaseErrorResponse } from '#types/error'
import HttpError from './http.errors'

export default class UnauthorizedError extends HttpError {
  private static readonly _statusCode: number = EHttpStatusCode.UNAUTHORIZED
  private readonly _code: number
  private readonly _logging: boolean

  constructor(message?: string, statusCode?: number, logging: boolean = true) {
    super(message ?? 'Request had invalid authentication credentials.')
    this._code = statusCode ?? UnauthorizedError._statusCode
    this._logging = logging
    Object.setPrototypeOf(this, new.target.prototype)
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }

  toJSON(): IBaseErrorResponse {
    return { message: this.message }
  }
}
