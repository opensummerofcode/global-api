import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';

@Module({
  imports: [UserResolver],
})
export class UserModule {}
