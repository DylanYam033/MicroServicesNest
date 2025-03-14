import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
    @ApiProperty({ example: 'JuanPerez', description: 'Nombre de usuario del cliente' })
    @IsString()
    @IsNotEmpty()
    nombreUsuario: string;

    @ApiProperty({ example: '123456789', description: 'Cédula del cliente' })
    @IsString()
    @IsNotEmpty()
    cedula: string;
}

export class GeneratePdfDto {
    @ApiProperty({
        example: '<h1>Comprobante de Pago</h1><p>Este es el recibo de pago</p>',
        description: 'HTML del comprobante de pago a generar',
    })
    @IsString()
    @IsNotEmpty()
    html: string;

    @ApiProperty({ type: UserDto, description: 'Datos del usuario' })
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;
}
