import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '@feature/user/user.module'
import { LocalStrategy } from '@shared/features/auth/guard/strategy/local.strategy'
import { ConfigModule } from '@nestjs/config'
import { JwtStrategy } from '@shared/features/auth/guard/strategy/jwt.strategy'

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: Number(process.env.TOKEN_EXPIRES_IN) },
    }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
