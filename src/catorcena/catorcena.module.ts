import { Module } from '@nestjs/common';
import { CatorcenaService } from './catorcena.service';
import { CatorcenaController } from './catorcena.controller';
import { DatabaseModule } from 'src/Database/database.module';

@Module({
  imports: [DatabaseModule], // Asegurar que DatabaseModule está en los imports
  providers: [CatorcenaService],
  controllers: [CatorcenaController],
  exports: [CatorcenaService], // 📌 Asegurar que se exporta
})
export class CatorcenaModule {}
