import { Module } from '@nestjs/common';
import { NewMembersService } from './new-members.service';
import { NewMembersController } from './new-members.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/Database/database.module';
import { CatorcenaModule } from 'src/catorcena/catorcena.module';

@Module({
  imports:[HttpModule,DatabaseModule,CatorcenaModule],
  providers: [NewMembersService],
  controllers: [NewMembersController],
  exports:[NewMembersService],
})
export class NewMembersModule {}
