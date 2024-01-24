import { EHttpStatusCode, IBaseErrorResponse } from '#types/error'
import HttpError from './http.errors'

export default class ObjectNotFoundError extends HttpError {
  private static readonly _statusCode: number = EHttpStatusCode.NOT_FOUND
  private readonly _code: number
  private readonly _logging: boolean

  constructor(message?: string, statusCode?: number, logging: boolean = true) {
    super(message ?? 'The requested URL path was not found on this object.')
    this._code = statusCode ?? ObjectNotFoundError._statusCode
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
