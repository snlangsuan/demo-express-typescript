import { EHttpStatusCode, IBaseErrorResponse } from '#types/error'
import HttpError from './http.errors'

export default class InsufficientPermissionError extends HttpError {
  private static readonly _statusCode: number = EHttpStatusCode.FORBIDDEN
  private readonly _code: number
  private readonly _logging: boolean

  constructor(message?: string, statusCode?: number, logging: boolean = true) {
    super(message ?? 'Insufficient permissions to access the resource.')
    this._code = statusCode ?? InsufficientPermissionError._statusCode
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
