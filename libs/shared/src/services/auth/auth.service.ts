import { Body, HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import * as querystring from 'querystring';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async login(data: any) {
    const { username, email, password } = data;
    const loginUsername = username || email; // Accepter soit username soit email

    if (!loginUsername) {
      return {
        error: "invalid_request",
        error_description: "Username or email is required"
      };
    }

    this.logger.log(`Tentative de connexion avec username/email: ${loginUsername}`);
    
    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
          grant_type: 'password',
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          username: loginUsername,
          password: password,
        }),
      },
    );
    const responseData = await response.json();
    this.logger.log(`Réponse de Keycloak: ${JSON.stringify({
      access_token: responseData.access_token ? `${responseData.access_token.substring(0, 20)}...` : 'none',
      token_type: responseData.token_type,
      expires_in: responseData.expires_in,
      error: responseData.error,
      error_description: responseData.error_description
    })}`);
    return responseData;
  }

  async register(data: any) {
    const { email, password, username, firstName, lastName } = data;

    try {
      const adminTokenResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: querystring.stringify({
            client_id: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: 'password',
            username: process.env.KEYCLOAK_ADMIN_USERNAME,
            password: process.env.KEYCLOAK_ADMIN_PASSWORD,
          }),
        },
      );

      if (!adminTokenResponse.ok) {
        throw new Error('Failed to obtain admin token');
      }

      const adminToken = await adminTokenResponse.json();

      const userResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/admin/realms/myrealm/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken.access_token}`,
          },
          body: JSON.stringify({
            username: username || email,
            email,
            firstName,
            lastName,
            enabled: true,
            credentials: [
              {
                type: 'password',
                value: password,
                temporary: false,
              },
            ],
          }),
        },
      );

      if (!userResponse.ok) {
        throw new Error('Failed to create user');
      }

      const locationHeader = userResponse.headers.get('Location');
      if (!locationHeader) {
        throw new Error('User created but ID not found in response');
      }
      const userId = locationHeader.split('/').pop();

      return this.userRepo.save({
        keycloak_id: userId,
        email,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Registration failed', 400);
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      this.logger.log(`Validation du token: ${token.substring(0, 20)}...`);
      
      // Vérifier que Keycloak est accessible
      if (!process.env.KEYCLOAK_URL) {
        this.logger.error('KEYCLOAK_URL n\'est pas défini dans les variables d\'environnement');
        throw new Error('Keycloak configuration missing');
      }

      try {
        // Méthode 1: Essayer d'abord la validation par userinfo
        const userInfoUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM || 'myrealm'}/protocol/openid-connect/userinfo`;
        this.logger.log(`Essai de validation avec userinfo: ${userInfoUrl}`);
        
        try {
          const response = await fetch(
            userInfoUrl,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          this.logger.log(`Status de la réponse userinfo: ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            // Si la réponse est OK, on traite normalement
            const userInfo = await response.json();
            this.logger.log(`UserInfo récupéré: ${JSON.stringify(userInfo)}`);
            
            // Vérifier que le token contient les informations attendues
            if (!userInfo.sub) {
              this.logger.error('Token invalide: sub manquant');
              throw new Error('Token invalide: sub manquant');
            }
            
            return await this.processUserInfo(userInfo);
          } else if (response.status === 403) {
            // Si on a un 403, on décode le token JWT manuellement
            this.logger.log('Accès userinfo interdit (403), décodage manuel du token...');
            return await this.processTokenManually(token);
          } else if (response.status === 401) {
            this.logger.error('Token expiré ou invalide (401)');
            throw new Error('Token expiré ou invalide');
          } else {
            // Autre erreur
            const errorBody = await response.text();
            this.logger.error(`Erreur de validation: ${response.status} - ${errorBody}`);
            throw new Error(`Erreur de validation: ${response.status}`);
          }
        } catch (fetchError) {
          this.logger.error(`Erreur lors de la requête userinfo: ${fetchError.message}`);
          // On essaie le décodage manuel si l'appel à userinfo échoue
          return await this.processTokenManually(token);
        }
      } catch (error) {
        this.logger.error(`Échec de toutes les méthodes de validation: ${error.message}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Erreur globale lors de la validation du token: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      return null;
    }
  }

  // Méthode pour traiter les informations utilisateur de Keycloak
  private async processUserInfo(userInfo: any): Promise<any> {
    // Check if user exists in our database
    let user = await this.userRepo.findOne({
      where: { keycloak_id: userInfo.sub },
    });

    if (!user) {
      this.logger.log(`Création d'un nouvel utilisateur avec keycloak_id: ${userInfo.sub}`);
      user = await this.userRepo.save({
        keycloak_id: userInfo.sub,
        email: userInfo.email || 'unknown@example.com',
      });
    } else {
      this.logger.log(`Utilisateur trouvé: ${user.id}`);
    }

    // Vérifier les rôles de l'utilisateur
    const roles = userInfo.realm_access?.roles || [];
    this.logger.log(`Rôles de l'utilisateur: ${JSON.stringify(roles)}`);

    // Return merged information from keycloak and our db
    return {
      ...userInfo,
      user_id: user.id,
      roles: roles,
    };
  }

  // Méthode pour décoder manuellement le token JWT
  private async processTokenManually(token: string): Promise<any> {
    try {
      this.logger.log('Décodage manuel du token JWT...');
      
      // Décoder le token (partie payload)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Format de token JWT invalide');
      }
      
      // Décoder le payload (partie du milieu)
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      this.logger.log(`Payload décodé: ${JSON.stringify(payload)}`);
      
      if (!payload.sub) {
        throw new Error('Token invalide: sub manquant dans le payload');
      }
      
      // Traiter comme un userInfo normal
      return await this.processUserInfo(payload);
    } catch (error) {
      this.logger.error(`Erreur lors du décodage manuel: ${error.message}`);
      throw error;
    }
  }
}
