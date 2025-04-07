import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Get()
  @ApiOperation({ summary: 'Liste paginée des salles' })
  @ApiResponse({ status: 200, description: 'Liste des salles retournée' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: "Nombre d'éléments à ignorer" })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: "Nombre maximum d'éléments à retourner" })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    const s = skip ? Number(skip) : 0;
    const l = limit ? Number(limit) : 10;
    return { rooms: await this.roomsService.findAll(s, l) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d’une salle spécifique' })
  @ApiResponse({ status: 200, description: 'Détails de la salle retournée' })
  async findOne(@Param('id') id: string) {
    return await this.roomsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Création d’une nouvelle salle' })
  @ApiResponse({ status: 201, description: 'Salle créée' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mise à jour d’une salle existante' })
  @ApiResponse({ status: 200, description: 'Salle mise à jour' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return await this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Suppression d’une salle' })
  @ApiResponse({ status: 204, description: 'Salle supprimée' })
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
  }
}
