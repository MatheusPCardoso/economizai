import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exception'
import { HttpExceptionFilter } from './common/filters/http-exception'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost, configService),
    new HttpExceptionFilter(configService)
  )
  app.enableCors({ origin: '*' })
  await app.listen(process.env.PORT ?? 3000)

  const url = await app.getUrl()
  console.log(`Application is running on: ${url}`)
}
bootstrap()
