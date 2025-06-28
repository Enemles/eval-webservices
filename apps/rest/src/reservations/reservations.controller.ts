import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Helper pour transformer le format snake_case en camelCase
function formatReservation(reservation) {
  if (!reservation) return null;

  return {
    id: reservation.id,
    userId: reservation.user_id,
    roomId: reservation.room_id,
    startTime: reservation.start_time,
    endTime: reservation.end_time,
    createdAt: reservation.created_at,
    status: reservation.status,
    user: reservation.user,
    room: reservation.room,
    notifications: reservation.notifications,
  };
}

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste paginée des réservations' })
  @ApiResponse({ status: 200, description: 'Liste des réservations retournée' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: "Nombre d'éléments à ignorer",
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre maximum d'éléments à retourner",
  })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    const s = skip ? Number(skip) : 0;
    const l = limit ? Number(limit) : 10;
    const reservations = await this.reservationsService.findAll(s, l);
    // Retourner un tableau et non un objet avec une clé reservations
    return reservations.map(formatReservation);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détails d'une réservation spécifique" })
  @ApiResponse({
    status: 200,
    description: 'Détails de la réservation retournée',
  })
  async findOne(@Param('id') id: string) {
    const reservation = await this.reservationsService.findOne(id);
    return formatReservation(reservation);
  }

  @Post()
  @ApiOperation({ summary: "Création d'une nouvelle réservation" })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  async create(@Body() createReservationDto: CreateReservationDto) {
    const reservation = await this.reservationsService.create(createReservationDto);
    return formatReservation(reservation);
  }

  @Put(':id')
  @ApiOperation({ summary: "Mise à jour d'une réservation existante" })
  @ApiResponse({ status: 200, description: 'Réservation mise à jour' })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const reservation = await this.reservationsService.update(id, updateReservationDto);
    return formatReservation(reservation);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'une réservation" })
  @ApiResponse({ status: 204, description: 'Réservation supprimée' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    try {
    await this.reservationsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Laisse passer l'erreur 404
      }
      throw error; // Pour les autres erreurs
    }
  }
}
