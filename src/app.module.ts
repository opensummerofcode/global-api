import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { UserModule } from './user/user.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';

const config = new ConfigService();

@Module({
  imports: [
    UserModule,
    GraphQLModule.forRoot({ autoSchemaFile: 'schema.gql' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
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
  ],
  providers: [ConfigService],
})
export class AppModule {}
