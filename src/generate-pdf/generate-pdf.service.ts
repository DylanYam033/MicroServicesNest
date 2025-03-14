import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { format as formatDate } from 'date-fns';
import { PDFOptions, PaperFormat } from 'puppeteer';
import { Buffer } from 'buffer';

@Injectable()
export class GeneratePdfService {
    private readonly s3Client: S3Client;
    private readonly bucketName = 'albaholding';
    private readonly region = 'us-east-1';

    constructor() {
        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: 'AKIASPSUXXKVJB46G4K7',
                secretAccessKey: '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',
            },
        });
    }

    async generatePDF(htmlContent: string): Promise<Buffer> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfOptions: PDFOptions = {
            format: 'a4' as PaperFormat,
            printBackground: true,
            scale: 0.9,
            preferCSSPageSize: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
        };

        const pdfBuffer = await page.pdf(pdfOptions);
        await browser.close();

        return Buffer.from(pdfBuffer); // Conversión a Buffer para evitar el error
    }

    async uploadPDF(pdfBuffer: Buffer, user: any): Promise<{ pdfUrl: string; s3Path: string }> {
        const fileName = `comprobante_pago_estudio_${user.nombreUsuario}_${user.cedula}_${formatDate(new Date(), 'yyyyMMddHHmmss')}.pdf`;
        const s3Path = `MyManager/Nomina/DesprendiblePago/${fileName}`;

        const uploadParams = {
            Bucket: this.bucketName,
            Key: s3Path,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        };

        await this.s3Client.send(new PutObjectCommand(uploadParams));

        const pdfUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Path}`;
        return { pdfUrl, s3Path };
    }

    async generateAndUploadPDF(htmlContent: string, user: any): Promise<{ pdfUrl: string; s3Path: string }> {
        const pdfBuffer = await this.generatePDF(htmlContent);
        return this.uploadPDF(pdfBuffer, user);
    }
}
