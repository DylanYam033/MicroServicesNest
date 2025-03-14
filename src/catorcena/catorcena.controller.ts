import { Controller, Get } from '@nestjs/common';
import { CatorcenaService } from './catorcena.service';

@Controller('catorcena')
export class CatorcenaController {
  constructor(private readonly catorcenaService: CatorcenaService) {}

  @Get('actual')
  async obtenerCatorcenaActual() {
    return this.catorcenaService.obtenerCatorcenaActual();
  }

  @Get('usuarios')
  async obtenerUsuariosPlataforma() {
    return this.catorcenaService.obtenerUsuariosPlataforma();
  }
}
