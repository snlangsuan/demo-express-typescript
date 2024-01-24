import { EHttpStatusCode, IBaseErrorDetail, IBaseErrorResponse } from '#types/error'
import HttpError from './http.errors'

export default class InvalidParameterError extends HttpError {
  private static readonly _statusCode: number = EHttpStatusCode.BAD_REQUEST
  private readonly _code: number
  private readonly _logging: boolean
  private readonly _details: Array<IBaseErrorDetail> | undefined

  constructor(message?: string, statusCode?: number, details?: Array<IBaseErrorDetail>, logging: boolean = true) {
    super(message ?? 'Invalid parameter.')
    this._code = statusCode ?? InvalidParameterError._statusCode
    this._logging = logging
    this._details = details
    Object.setPrototypeOf(this, new.target.prototype)
  }

  get statusCode() {
    return this._code
  }

  get logging() {
    return this._logging
  }

  get details() {
    return this._details
  }

  toJSON(): IBaseErrorResponse {
    return { message: this.message, ...(this._details && { details: this._details }) }
  }
}
