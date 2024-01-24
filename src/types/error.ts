export enum EHttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
}

export interface IBaseErrorDetail {
  property: string
  messsage: string
}

export interface IBaseErrorResponse {
  message: string
  details?: Array<IBaseErrorDetail>
}
