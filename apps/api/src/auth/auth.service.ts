import { DatabaseService } from '@/database/database.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './auth.dto'
import { sign } from 'jsonwebtoken'
import { LoginResponse } from './auth.response'
import { compare } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(data: LoginDto): Promise<LoginResponse> {
    const auth = await this.databaseService.auth.findUnique({
      where: { email: data.email },
      include: { wallet: true },
    })

    if (!auth) throw new UnauthorizedException()

    const passwordMatch = await compare(data.password, auth.password)
    if (!passwordMatch) throw new UnauthorizedException()

    const { wallet: wallets, password, ...rest } = auth

    const token = sign({ wallets, auth: rest }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    })

    return { success: true, wallets, auth: rest, token }
  }
}
