import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from 'src/Database/database.service';
import { CatorcenaService } from '../catorcena/catorcena.service';
import { firstValueFrom } from 'rxjs';

interface NewMembersResponse {
    fecha_inicio: string;
    fecha_fin: string;
    usuarios: any[];
}


@Injectable()
export class NewMembersService {
    private readonly API_URL = 'https://partner-api.modelcenter.jasmin.com/v1/performers/member-management/member-counts';
    private readonly apiKeys = [
        '491f3d01e1103c51398f2f78737fdfc4e2c05641be19a8e76d5052b1316f4ed5',
        '27aa0576c68a3500b4c6f2991b988e657698ab5b1fcc9f5b51ef9fa1147031c4',
        '9fa8a4dcd38279909012aaf94684ad55f7383992602d7427f0511242b9126ea7',
        '40ac53eacee9880469f0c1a78efe712cdecc80e5f38bf21a2661ea82c2cf413d',
        'b66856654bf0e7738ecd10309c10ed4c0dc7500ed11b60d36d333a56724ea7b8',
    ];

    constructor(
        private readonly httpService: HttpService,
        private readonly db: DatabaseService,
        private readonly catorcenaService: CatorcenaService,
    ) { }


    /**
       * Introduce un retraso en la ejecución.
       * @param ms Milisegundos a esperar.
       */
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    /**
     * Obtiene el número de nuevos miembros para un performer probando diferentes API Keys y manejando los límites de rate limit.
     * @param screenName Nombre de usuario del performer.
     * @param fromDate Fecha de inicio del rango de consulta.
     * @param toDate Fecha de finalización del rango de consulta.
     * @returns Número de nuevos miembros.
     */
    private async getNewMemberCount(screenName: string, fromDate: string, toDate: string): Promise<number> {
        for (const apiKey of this.apiKeys) {
            try {
                console.log(`🔄 Consultando miembros para ${screenName} con API Key: ${apiKey.substring(0, 10)}...`);

                const response = await firstValueFrom(this.httpService.get(this.API_URL, {
                    params: { 'screenNames[]': screenName, fromDate, toDate },
                    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
                }));

                if (response.status === 200 && response.data.data) {
                    const performerData = response.data.data.find(item => item.performerScreenName === screenName);
                    return performerData ? performerData.memberCount : 0;
                }
            } catch (error) {
                if (error.response?.status === 429) {
                    await this.delay(2000); // Esperar 2 segundos antes de intentar con otra API Key
                }
            }
        }
        return 0;
    }


    /**
     * Obtiene la cantidad de nuevos miembros en la catorcena actual para cada usuario.
     * @returns Un objeto con la fecha de inicio, fecha de fin y la lista de usuarios con sus nuevos miembros.
     */
    async obtenerNewMembersPorUsuario(): Promise<NewMembersResponse | []> {
        try {
            const catorcena = await this.catorcenaService.obtenerCatorcenaActual();
            if (!catorcena) {
                console.log("⚠️ No hay una catorcena activa.");
                return [];
            }

            const fromDate = new Date(catorcena.fecha_inicial).toISOString().split('.')[0] + 'Z';
            const toDate = new Date(catorcena.fecha_final).toISOString().split('.')[0] + 'Z';

            let usuarios = await this.catorcenaService.obtenerUsuariosPlataforma();
            if (!usuarios.length) {
                console.log("⚠️ No hay usuarios activos.");
                return [];
            }

            for (const usuario of usuarios) {
                usuario.count = await this.getNewMemberCount(usuario.lj_screen_name, fromDate, toDate);
                usuario.fromDate = fromDate;
                usuario.toDate = toDate;
            }

            return { fecha_inicio: catorcena.fecha_inicial, fecha_fin: catorcena.fecha_final, usuarios };
        } catch (error) {
            console.error("❌ Error en obtenerNewMembersPorUsuario:", error);
            throw error;
        }
    }


    /**
   * Obtiene la cantidad de nuevos miembros en la catorcena actual para cada usuario y los inserta en la base de datos.
   * 
   * @returns Mensaje de confirmación tras la inserción en la base de datos.
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
    async obtenerYGuardarNewMembersPorUsuario() {
        try {
            const data = await this.obtenerNewMembersPorUsuario();

            if (!data || !('usuarios' in data) || data.usuarios.length === 0) {
                console.log("⚠️ No hay datos para insertar.");
                return;
            }

            console.log("💾 Insertando datos en las bases de datos...");

            for (const usuario of data.usuarios) {
                const { id_usuario, count, fromDate, toDate } = usuario;
                await this.db.queryMySQL(
                    'INSERT INTO alba_jasmin_info.miembros_modelos_jasmin (id_usuario, cantidad_miembros) VALUES (?, ?)',
                    [id_usuario, count]
                );

                await this.db.queryPostgres(
                    'INSERT INTO miembros_modelos_jasmin (id_usuario, cantidad_miembros, fechacreacion, fecha_inicio, fecha_fin) VALUES ($1, $2, NOW(), $3, $4)',
                    [id_usuario, count, fromDate.split('T')[0], toDate.split('T')[0]]
                );
            }

            console.log("✅ Datos insertados correctamente en ambas bases de datos.");
        } catch (error) {
            console.error("❌ Error en obtenerYGuardarNewMembersPorUsuario:", error);
        }
    }

}
