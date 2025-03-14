import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CatorcenaService } from '../catorcena/catorcena.service';
import { NewMembersService } from '../new-members/new-members.service';

@Injectable()
export class ScheduleTaskService implements OnModuleInit {
  constructor(
    private readonly catorcenaService: CatorcenaService,
    private readonly newMembersService: NewMembersService,
  ) {}

  async ejecutarTarea() {
    console.log('[⏳] Verificando catorcena...');
    try {
      const catorcena = await this.catorcenaService.obtenerCatorcenaActual();
      if (!catorcena) {
        console.log('[❌] No hay una catorcena activa.');
        return;
      }
      
      const fechaFinal = new Date(catorcena.fecha_final).toISOString().split('T')[0];
      const fechaActual = new Date().toISOString().split('T')[0];

      if (fechaFinal === fechaActual) {
        console.log('[🔥] Ejecutando tarea programada...');
        await this.newMembersService.obtenerYGuardarNewMembersPorUsuario();
        console.log('[✅] Tarea ejecutada correctamente.');
      } else {
        console.log('[❌] Hoy no es el día de ejecución.');
      }
    } catch (error) {
      console.error('❌ Error ejecutando la tarea automática:', error);
    }
  }

  /**
   * Programar la tarea para ejecutarse automáticamente a las 7:00 PM y 8:00 PM.
   */
  @Cron('0 19 * * *')
  handleCron19() {
    this.ejecutarTarea();
  }

  @Cron('0 20 * * *')
  handleCron20() {
    this.ejecutarTarea();
  }

  onModuleInit() {
    console.log('[✅] Tareas programadas para ejecutarse a las 7 y 8 PM si corresponde.');
  }
}
