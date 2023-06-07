import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/src/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const port = parseInt(process.env.EXPRESS_PORT as string, 10) || 3000

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  app.enableCors()

  await app.listen(port)
}

bootstrap()
