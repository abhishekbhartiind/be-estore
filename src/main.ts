import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from '@/src/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ClassSerializerInterceptor, Logger } from '@nestjs/common'

async function bootstrap() {
  const host = String(process.env.EXPRESS_HOST)
  const port = parseInt(process.env.EXPRESS_PORT as string, 10) || 4000
  const graphqlEndpoint = 'graphql'

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.enableCors({
    origin: [
      String(process.env.APOLLO_STUDIO),
      String(process.env.FRONTEND_HOST),
    ],
    credentials: true,
  })

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  await app.listen(port)

  Logger.log(
    `Running a GraphQL API server at: http://${host}:${port}/${graphqlEndpoint}`,
  )
}

bootstrap()
