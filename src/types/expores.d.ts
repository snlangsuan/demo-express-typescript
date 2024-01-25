import { IUserAccount } from '#models/user.models'

declare global {
  namespace Express {
    export interface Request {
      user?: IUserAccount
    }
  }
}

declare module 'http' {
  interface IncomingMessage {
    query: Record<string, unknown>
    params: Record<string, unknown>
    raw: {
      body: Record<string, unknown>
    }
  }
}
