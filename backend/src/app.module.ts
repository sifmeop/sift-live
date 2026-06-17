import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtModule } from '@nestjs/jwt'

import { GqlContext } from './common/interfaces/gql-context.interface'
import envConfig from './config/env.config'
import { AuthModule } from './modules/auth/auth.module'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { RedisModule } from './modules/redis/redis.module'
import { StreamModule } from './modules/stream/stream.module'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
      context: ({ req, res }: GqlContext) => ({ req, res }),
    }),
    JwtModule.register({ global: true }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigService],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService<EnvConfig>) => ({
    //     ttl: configService.getOrThrow<string>('THROTTLE_TTL'),
    //     limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
    //   }),
    // }),
    PrismaModule,
    AuthModule,
    UserModule,
    RedisModule,
    StreamModule,
  ],
  controllers: [],
  providers: [
    // s
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
