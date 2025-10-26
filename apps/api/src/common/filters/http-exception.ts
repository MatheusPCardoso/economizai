import { CustomError } from './custom-error'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception?.getStatus()
    const exceptionResponse = exception.getResponse()
    let message = exceptionResponse['message'] || exception?.message
    const isProduction = this.configService.get('DEV') !== 'true'

    this.logger.error(`Exception: ${exception?.message}, Status: ${status}`)

    const defaultResponse: {
      statusCode: number
      timestamp: string
      message: string
      stack?: string
      details?: any
    } = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    }

    let responseJson = isProduction
      ? defaultResponse
      : { ...defaultResponse, stack: exception.stack }

    if (exception instanceof CustomError) {
      responseJson = {
        ...responseJson,
        details: exception?.getErrorDetails(),
      }
    }

    response.status(status).json(responseJson)
  }
}
