import { NotFoundException } from '@nestjs/common'

export class NotFoundRecurringError extends NotFoundException {
  constructor() {
    super('Nada cadastrado aqui')
  }
}
