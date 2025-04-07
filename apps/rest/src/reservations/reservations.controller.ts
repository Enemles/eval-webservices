import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Get()
  @ApiOperation({ summary: 'Liste paginée des réservations' })
  @ApiResponse({ status: 200, description: 'Liste des réservations retournée' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: "Nombre d'éléments à ignorer" })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: "Nombre maximum d'éléments à retourner" })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    const s = skip ? Number(skip) : 0;
    const l = limit ? Number(limit) : 10;
    return { reservations: await this.reservationsService.findAll(s, l) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d’une réservation spécifique' })
  @ApiResponse({ status: 200, description: 'Détails de la réservation retournée' })
  async findOne(@Param('id') id: string) {
    return await this.reservationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Création d’une nouvelle réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  async create(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationsService.create(createReservationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mise à jour d’une réservation existante' })
  @ApiResponse({ status: 200, description: 'Réservation mise à jour' })
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return await this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Suppression d’une réservation' })
  @ApiResponse({ status: 204, description: 'Réservation supprimée' })
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.reservationsService.remove(id);
  }
}
