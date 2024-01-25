import { IBaseErrorDetail } from '#types/error'
import { pino } from 'pino'
import { ZodError } from 'zod'

export const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
})

export const parseValidateErrorDetails = (error: ZodError): Array<IBaseErrorDetail> => {
  const details: Array<IBaseErrorDetail> = error.issues.map((err) => ({
    property: err.path.join('.'),
    messsage: err.message,
  }))
  return details
}
