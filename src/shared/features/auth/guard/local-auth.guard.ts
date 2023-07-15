import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { CookieSerializeOptions } from '@fastify/cookie'

const HTTP_ONLY_COOKIE: CookieSerializeOptions = {
  maxAge: Number(process.env.TOKEN_EXPIRES_IN) * 1000,
  httpOnly: true,
  signed: true,
  domain: 'http://localhost:4000',
}

const USERS_COOKIE: CookieSerializeOptions = {
  maxAge: Number(process.env.TOKEN_EXPIRES_IN) * 1000,
  domain: 'http://localhost:4000',
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly jwtService: JwtService) {
    super()
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const graphqlRequest = ctx.getContext().req

    console.log(HTTP_ONLY_COOKIE)
    if (graphqlRequest) {
      const { input } = ctx.getArgs()
      graphqlRequest.body = input
      return graphqlRequest
    }

    return context.switchToHttp().getRequest()
  }

  // @ts-ignore
  handleRequest(error, user, info, context) {
    if (error || !user || info) throw error || new UnauthorizedException()

    const authContext = GqlExecutionContext.create(context)

    const tokenExpiresMilliseconds = Number(process.env.TOKEN_EXPIRES_IN) * 1000
    const tokenExpires = Date.now() + tokenExpiresMilliseconds

    Logger.debug(authContext.getContext().req.raw.rawHeaders)

    const { id, email, role } = user
    Logger.debug(id)
    Logger.debug(email)
    Logger.debug(role)
    const payload = { sub: user.id, email: user.email, role: user.role }

    // noinspection JSDeprecatedSymbols
    const accessToken = this.jwtService.sign(payload)

    const request = authContext.getContext().req
    request.res?.cookie('access_token', accessToken, HTTP_ONLY_COOKIE)
    request.res?.cookie('token-expires', tokenExpires.toString(), USERS_COOKIE)

    return user
  }
}
