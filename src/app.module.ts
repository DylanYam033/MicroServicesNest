import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './Database/database.module';
import { CatorcenaModule } from './catorcena/catorcena.module';
import { GeneratePdfModule } from './generate-pdf/generate-pdf.module';
import { ScheduleTaskModule } from './schedule-task/schedule-task.module';
import { NewMembersModule } from './new-members/new-members.module';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
  }), GeneratePdfModule, ScheduleTaskModule, DatabaseModule, CatorcenaModule, NewMembersModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
