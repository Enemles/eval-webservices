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
    this.logger.log(`Réponse de Keycloak: ${JSON.stringify(responseData)}`);
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
      
      const response = await fetch(
        `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/userinfo`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        this.logger.error(`Échec de validation du token. Statut: ${response.status}`);
        const errorBody = await response.text();
        this.logger.error(`Détail de l'erreur: ${errorBody}`);
        return null;
      }

      const userInfo = await response.json();
      this.logger.log(`UserInfo récupéré: ${JSON.stringify(userInfo)}`);

      // Check if user exists in our database
      let user = await this.userRepo.findOne({
        where: { keycloak_id: userInfo.sub },
      });

      if (!user) {
        this.logger.log(`Création d'un nouvel utilisateur avec keycloak_id: ${userInfo.sub}`);
        user = await this.userRepo.save({
          keycloak_id: userInfo.sub,
          email: userInfo.email,
        });
      } else {
        this.logger.log(`Utilisateur trouvé: ${user.id}`);
      }

      // Return merged information from keycloak and our db
      return {
        ...userInfo,
        user_id: user.id,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la validation du token: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      return null;
    }
  }
}
