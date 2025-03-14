import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') }); // Cargar el archivo desde la raíz


@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private mysqlPool: mysql.Pool;
  private postgresPool: Pool;

  async onModuleInit() {
    this.mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.postgresPool = new Pool({
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      max: 10,
    });

    console.log('✅ Conectado a MySQL y PostgreSQL');

    console.log('Postgres Config: ', {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD, // Esto debería imprimir la contraseña
        database: process.env.PG_DATABASE,
      });
  }

  async queryMySQL(query: string, params?: any[]): Promise<any> {
    const [rows] = await this.mysqlPool.execute(query, params);
    return rows;
  }

  async queryPostgres(query: string, params?: any[]): Promise<any> {
    const client = await this.postgresPool.connect();
    try {
      const res = await client.query(query, params);
      return res.rows;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.mysqlPool.end();
    await this.postgresPool.end();
    console.log('🔴 Conexiones cerradas a MySQL y PostgreSQL');
  }
}
