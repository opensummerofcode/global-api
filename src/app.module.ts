import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { UserModule } from './user/user.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      useFactory: async (authService: AuthService) => ({
        autoSchemaFile: 'schema.gql',
        context: async ({ req, res }) => {
          const user = await authService.loggedUser(req.cookies);
          return { req, res, user };
        },
      }),
      inject: [AuthService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGODB_URI'),
        dbName: config.get('DB_NAME'),
        useNewUrlParser: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const APP_EMAIL_ADDR = config.get('APP_EMAIL_ADDR');
        const APP_EMAIL_PASS = config.get('APP_EMAIL_PASS');
        const APP_EMAIL_PROV = config.get('APP_EMAIL_PROV');
        return {
          transport: `smtps://${APP_EMAIL_ADDR}:${APP_EMAIL_PASS}@${APP_EMAIL_PROV}`,
          defaults: {
            from: `oSoc Global <${APP_EMAIL_ADDR}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(), // or new PugAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    ConfigModule,
    AuthModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
