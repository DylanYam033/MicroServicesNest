import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CatorcenaModule } from 'src/catorcena/catorcena.module';
import { NewMembersModule } from 'src/new-members/new-members.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CatorcenaModule,
    NewMembersModule,
  ],
  providers: [ScheduleTaskService]
})
export class ScheduleTaskModule {}
