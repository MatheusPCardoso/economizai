import { HttpException, HttpStatus } from '@nestjs/common'

export class CustomError extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    private readonly details?: any
  ) {
    super(message, status)
  }

  getErrorDetails() {
    return this.details
  }
}
