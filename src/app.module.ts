import { Module } from '@nestjs/common';
import { GeneratePdfModule } from './generate-pdf/generate-pdf.module';

@Module({
  imports: [GeneratePdfModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
