import { Controller, Get, Post, Put, Body, Param, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login')
  @ApiOperation({ summary: 'Login utilisateur' })
  @ApiResponse({ status: 200, description: 'Token JWT retourné' })
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste paginée des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs retournée' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: "Nombre d'éléments à ignorer" })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: "Nombre maximum d'éléments à retourner" })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    const s = skip ? Number(skip) : 0;
    const l = limit ? Number(limit) : 10;
    return { users: await this.usersService.findAll(s, l) };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détails d’un utilisateur spécifique' })
  @ApiResponse({ status: 200, description: 'Détails de l’utilisateur retournés' })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Création d’un nouvel utilisateur (admin)' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/extract')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Extraction CSV des réservations d’un utilisateur' })
  @ApiResponse({ status: 200, description: 'URL du fichier CSV retournée' })
  async extract(@Param('id') id: string) {
    return await this.usersService.extract(id);
  }
}
