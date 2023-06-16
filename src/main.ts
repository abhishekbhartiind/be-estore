import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from '@/src/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ClassSerializerInterceptor } from '@nestjs/common'

async function bootstrap() {
  const host = String(process.env.EXPRESS_HOST)
  const port = parseInt(process.env.EXPRESS_PORT as string, 10) || 3000

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  app.enableCors()

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  await app.listen(port)

  console.info(
    `Running a GraphQL API server at: http://${host}:${port}/graphql`,
  )
}

bootstrap()
