import { IsNotEmpty, IsString } from 'class-validator'

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  authId: string
}

export class UpdateWalletDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string
}
