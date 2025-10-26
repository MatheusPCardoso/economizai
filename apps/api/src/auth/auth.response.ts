import { DefaultResponse } from '@/common/response'
import { Auth, Wallet } from '@prisma/client'

export class LoginResponse extends DefaultResponse {
  token: string
  auth: Omit<Auth, 'password'>
  wallets: Wallet[]
}
