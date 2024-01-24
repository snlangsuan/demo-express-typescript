import { IBaseErrorResponse } from '#types/error'

export default abstract class HttpError extends Error {
  abstract readonly statusCode: number
  abstract readonly logging: boolean

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }

  abstract toJSON(): IBaseErrorResponse
}
