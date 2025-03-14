import { Controller, Get } from '@nestjs/common';
import { NewMembersService } from './new-members.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('New Members')
@Controller('new-members')
export class NewMembersController {
    constructor(private readonly newMembersService: NewMembersService) { }
    /**
       * Obtiene y guarda la cantidad de nuevos miembros por usuario en la catorcena actual.
       * 
       * @returns Un mensaje de confirmación tras la inserción de datos en la base de datos.
       * 
       * @example
       * GET /new-members
       * 
       * Response:
       * ```json
       * {
       *   "message": "✅ Datos insertados correctamente en ambas bases de datos."
       * }
       * ```
       */
    @Get()
    @ApiOperation({ summary: 'Obtener y guardar nuevos miembros', description: 'Consulta la cantidad de nuevos miembros para cada usuario en la catorcena actual y guarda los datos en la base de datos.' })
    @ApiResponse({ status: 200, description: 'Datos insertados correctamente en ambas bases de datos.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async obtenerYGuardarNewMembersPorUsuario() {
        return this.newMembersService.obtenerYGuardarNewMembersPorUsuario();
    }
}
