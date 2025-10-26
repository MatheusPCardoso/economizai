import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { RecurringService } from './recurring.service'
import { CreateRecurringDto, UpdateRecurringDto } from './recurring-dto'

@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  create(@Body() createRecurringDto: CreateRecurringDto) {
    return this.recurringService.create(createRecurringDto)
  }

  @Get('by-wallet/:walletId')
  findAllByWalletId(@Param('walletId') walletId: string) {
    return this.recurringService.findAllByWalletId(walletId)
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateRecurringDto: UpdateRecurringDto) {
    return this.recurringService.update(id, updateRecurringDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.recurringService.remove(id)
  }
}
