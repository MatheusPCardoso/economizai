import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@database/database.service'
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto'
import {
  CreateWalletError,
  DeleteWalletError,
  FindWalletError,
  UpdateWalletError,
} from './wallet.error'

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByAuthId(authId: string) {
    try {
      return await this.databaseService.wallet.findMany({ where: { authId } })
    } catch (error) {
      throw new FindWalletError(error.message)
    }
  }

  async create(data: CreateWalletDto) {
    try {
      return await this.databaseService.wallet.create({
        data: {
          name: data.name,
          auth: {
            connect: {
              id: data.authId,
            },
          },
        },
      })
    } catch (error) {
      throw new CreateWalletError(error.message)
    }
  }

  async update(data: UpdateWalletDto) {
    const { id, ...rest } = data
    try {
      return await this.databaseService.wallet.update({
        where: { id },
        data: rest,
      })
    } catch (error) {
      throw new UpdateWalletError(error.message)
    }
  }

  async delete(id: string) {
    try {
      return await this.databaseService.wallet.delete({ where: { id } })
    } catch (error) {
      throw new DeleteWalletError(error.message)
    }
  }
}
