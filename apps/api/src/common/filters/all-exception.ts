import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  constructor(
    private httpAdapterHost: HttpAdapterHost,
    private configService: ConfigService
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const isProduction = this.configService.get('DEV') !== 'true'

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    const message = 'Erro interno do servidor 😔'

    this.logger.error(`Exception: ${exception.message}, stack: ${exception.stack}`)

    const defaultBodyReponse = {
      statusCode: httpStatus,
      message: message,
    }

    const responseBody = isProduction
      ? defaultBodyReponse
      : { ...defaultBodyReponse, stack: exception.stack }

    httpAdapter.reply(response, responseBody, httpStatus)
  }
}
