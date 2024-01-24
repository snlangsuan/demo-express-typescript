export enum NodeEnvType {
  production = 'production',
  development = 'development',
  staging = 'staging',
  uat = 'uat',
}

export interface ApplicationConfig {
  nodeEnv: NodeEnvType
  host: string
  port: number
  accessTokenPrivateKey: string
  accessTokenPublicKey: string
  accessTokenExpiry: number
  refreshTokenPrivateKey: string
  refreshTokenPublicKey: string
  refreshTokenExpiry: number
  resetPasswordExpiry: number
  baseUrl: string
  databaseUrl: string
  whitelist: Array<string>
}
