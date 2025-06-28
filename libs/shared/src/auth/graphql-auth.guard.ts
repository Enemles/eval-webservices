import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../services/auth/auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug(
        "Opération GraphQL publique, pas besoin d'authentification",
      );
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const info = ctx.getInfo();

    this.logger.debug(
      `Vérification du token pour l'opération GraphQL: ${info.fieldName}`,
    );

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn("En-tête d'autorisation manquant ou mal formaté");
      throw new UnauthorizedException('Token missing or invalid format');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      this.logger.warn('Token non fourni après "Bearer"');
      throw new UnauthorizedException('Token not provided');
    }

    try {
      // Validate token with Keycloak
      const userInfo = await this.authService.validateToken(token);

      if (!userInfo) {
        this.logger.warn('Token invalide ou erreur de validation');
        throw new UnauthorizedException('Invalid token');
      }

      this.logger.debug(`Utilisateur authentifié: ${userInfo.preferred_username || userInfo.email || userInfo.sub}`);

      // Vérifier les rôles si nécessaire
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (requiredRoles && requiredRoles.length > 0) {
        const userRoles = userInfo.roles || [];
        const hasRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
          this.logger.warn(`Accès refusé: l'utilisateur n'a pas les rôles requis (${requiredRoles.join(', ')})`);
          throw new UnauthorizedException('Insufficient permissions');
        }

        this.logger.debug(`Rôles validés: ${requiredRoles.join(', ')}`);
      }

      // Attach user info to request for use in resolvers
      req.user = userInfo;
      return true;
    } catch (error) {
      this.logger.error(`Erreur d'authentification: ${error.message}`);
      throw new UnauthorizedException(`Authentication failed: ${error.message}`);
    }
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
} 