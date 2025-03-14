import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/Database/database.service';

@Injectable()
export class CatorcenaService {
  constructor(private readonly db: DatabaseService) { }

  /**
   * Obtiene la catorcena actual basada en la fecha del sistema.
   * @returns Objeto con id_catorcena, fecha_inicio y fecha_fin o null si no hay catorcena activa.
   */
  async obtenerCatorcenaActual(): Promise<any> {
    try {
      const query = `
        SELECT id_catorcena, fecha_inicial, fecha_final
        FROM catorcenas
        WHERE CURRENT_DATE >= fecha_inicial
        AND CURRENT_DATE <= fecha_final
        LIMIT 1;
      `;

      const result = await this.db.queryPostgres(query);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('❌ Error obteniendo la catorcena actual:', error);
      throw error;
    }
  }

  /**
   * Obtiene los usuarios de la plataforma sin procesar tokens ni performerId.
   */
  async obtenerUsuariosPlataforma(): Promise<any[]> {
    try {
      const query = `
        SELECT id_usuario_plataforma, id_usuario, nickname, lj_screen_name, email_plataforma, activo
        FROM usuarios_plataforma
        WHERE id_plataforma = $1
        AND email_plataforma IS NOT NULL AND email_plataforma <> ''
        AND password IS NOT NULL AND password <> ''
        AND lj_screen_name IS NOT NULL AND lj_screen_name <> ''
        AND activo = true;
      `;

      return await this.db.queryPostgres(query, [3]);
    } catch (error) {
      console.error('❌ Error obteniendo usuarios de la plataforma:', error);
      throw error;
    }
  }

  /**
  * Inserta un nuevo miembro en PostgreSQL.
  */
  async insertarMiembroJasminPostgres(id_usuario: number, cantidad_miembros: number, fecha_inicio: string, fecha_fin: string): Promise<number> {
    try {
      const query = `
        INSERT INTO miembros_modelos_jasmin (id_usuario, cantidad_miembros, fechacreacion, fecha_inicio, fecha_fin)
        VALUES ($1, $2, NOW(), $3, $4)
        RETURNING id_miembro;
      `;

      const values = [id_usuario, cantidad_miembros, fecha_inicio, fecha_fin];
      const result = await this.db.queryPostgres(query, values);
      console.log(`✅ Miembro insertado en PostgreSQL con ID: ${result[0].id_miembro}`);
      return result[0].id_miembro;
    } catch (error) {
      console.error("❌ Error insertando en PostgreSQL:", error);
      throw error;
    }
  }

  /**
   * Inserta un nuevo miembro en MySQL.
   */
  async insertarMiembroJasminMySQL(id_usuario: number, cantidad_miembros: number): Promise<number> {
    try {
      const query = `
        INSERT INTO alba_jasmin_info.miembros_modelos_jasmin (id_usuario, cantidad_miembros)
        VALUES (?, ?);
      `;

      const result = await this.db.queryMySQL(query, [id_usuario, cantidad_miembros]);
      console.log(`✅ Miembro insertado en MySQL (alba_jasmin_info) con ID: ${result.insertId}`);
      return result.insertId;
    } catch (error) {
      console.error("❌ Error insertando en MySQL (alba_jasmin_info):", error);
      throw error;
    }
  }
}
