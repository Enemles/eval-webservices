import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ReservationType } from './reservation.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field({ name: 'keycloak_id' })
  keycloakId: string;

  @Field()
  email: string;

  @Field({ name: 'created_at' })
  createdAt: Date;

  @Field(() => [ReservationType])
  reservations: ReservationType[];
}

@InputType()
export class createUserInput {
  @Field({ name: 'keycloak_id' })
  keycloakId: string;

  @Field()
  email: string;
}
