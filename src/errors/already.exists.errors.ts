import { EHttpStatusCode, IBaseErrorResponse } from '#types/error'
import HttpError from './http.errors'

export default class AlreadyExistsError extends HttpError {
  private static readonly _statusCode: number = EHttpStatusCode.CONFLICT
  private readonly _code: number
  private readonly _logging: boolean

  constructor(message?: string, statusCode?: number, logging: boolean = true) {
    super(message ?? 'Object already exists.')
    this._code = statusCode ?? AlreadyExistsError._statusCode
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
