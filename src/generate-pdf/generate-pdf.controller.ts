import { Body, Controller, Post } from '@nestjs/common';
import { GeneratePdfService } from './generate-pdf.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('PDFs')
@Controller('pdf')
export class GeneratePdfController {
    constructor(private readonly pdfService: GeneratePdfService) {}

    @Post('generate')
    @ApiBody({ type: GeneratePdfDto })
    async generatePDF(@Body() generatePdfDto: GeneratePdfDto) {
        const { pdfUrl, s3Path } = await this.pdfService.generateAndUploadPDF(generatePdfDto.html, generatePdfDto.user);
        return {
            message: 'PDF generado y subido con éxito',
            pdf_url: pdfUrl,
            s3_path: s3Path,
        };
    }
}
