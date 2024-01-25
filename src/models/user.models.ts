export type TUserRole = 'admin' | 'user'

export interface IUserAccount {
  id: number
  username: string
  display_name: string
  role: TUserRole
}

export interface IUserCredential {
  username: string
  password: string
}

export interface IUserCredentialResponse {
  access_token: string
  refresh_token: string
  expired: number
}
