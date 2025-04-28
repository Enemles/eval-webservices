import { UserEntity } from '@app/shared/entities/user.entity';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as querystring from 'querystring';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) { }

  public async login(data: any) {
    const { username, password } = data;

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
          username: username,
          password: password,
        }),
      },
    );
    const responseData = await response.json();

    if (responseData.error) {
      throw new UnauthorizedException(responseData.error_description || 'Login failed');
    }

    // Essayer de trouver l'utilisateur par email (qui est généralement le username dans Keycloak)
    const userInfo = await this.getUserInfo(responseData.access_token);
    const user = await this.userRepo.findOne({ where: { email: userInfo.email } });

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    return {
      user,
      tokens: responseData
    };
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
            username,
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
        username
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Registration failed', 400);
    }
  }


  async getUserInfo(token: string) {
    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new UnauthorizedException('Invalid token');
    }

    return await response.json();
  }

  async validateToken(token: string) {
    try {
      const userInfo = await this.getUserInfo(token);
      return userInfo;
    } catch (error) {
      return null;
    }
  }

  async introspectToken(token: string) {
    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/token/introspect`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          token: token
        }),
      },
    );

    const introspection = await response.json();

    if (!introspection.active) {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    return introspection;
  }
}