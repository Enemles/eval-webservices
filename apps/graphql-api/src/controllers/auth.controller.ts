// import { Body, Controller, HttpException, Post } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserEntity } from 'apps/graphql/entities/user.entity';
// import * as querystring from 'querystring';
// import { Repository } from 'typeorm';

// @Controller('auth')
// export class authController {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepo: Repository<UserEntity>,
//   ) {}

//   @Post('login')
//   public async login(@Body() data: any) {
//     const { username, password } = data;

//     const response = await fetch(
//       `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/token`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: querystring.stringify({
//           grant_type: 'password',
//           client_id: process.env.KEYCLOAK_CLIENT_ID,
//           client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
//           username: username,
//           password: password,
//         }),
//       },
//     );
//     const responseData = await response.json();
//     console.log(responseData);
//     return responseData;
//   }

//   @Post('register')
//   async register(@Body() data: any) {
//     const { email, password, username, firstName, lastName } = data;

//     try {
//       const adminTokenResponse = await fetch(
//         `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: querystring.stringify({
//             client_id: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
//             client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
//             grant_type: 'password',
//             username: process.env.KEYCLOAK_ADMIN_USERNAME,
//             password: process.env.KEYCLOAK_ADMIN_PASSWORD,
//           }),
//         },
//       );

//       if (!adminTokenResponse.ok) {
//         throw new Error('Failed to obtain admin token');
//       }

//       const adminToken = await adminTokenResponse.json();

//       const userResponse = await fetch(
//         `${process.env.KEYCLOAK_URL}/admin/realms/myrealm/users`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${adminToken.access_token}`,
//           },
//           body: JSON.stringify({
//             username,
//             email,
//             firstName,
//             lastName,
//             enabled: true,
//             credentials: [
//               {
//                 type: 'password',
//                 value: password,
//                 temporary: false,
//               },
//             ],
//           }),
//         },
//       );

//       if (!userResponse.ok) {
//         throw new Error('Failed to create user');
//       }

//       const locationHeader = userResponse.headers.get('Location');
//       if (!locationHeader) {
//         throw new Error('User created but ID not found in response');
//       }
//       const userId = locationHeader.split('/').pop();

//       return this.userRepo.save({
//         keycloak_id: userId,
//         email,
//       });
//     } catch (error) {
//       console.error(error);
//       throw new HttpException('Registration failed', 400);
//     }
//   }
// }
