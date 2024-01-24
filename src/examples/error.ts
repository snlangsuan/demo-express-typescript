import { IBaseErrorResponse } from '#types/error'

export const error401: IBaseErrorResponse = {
  message: 'Request had invalid authentication credentials.',
}
