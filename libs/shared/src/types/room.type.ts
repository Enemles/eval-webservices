import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ReservationType } from './reservation.type';

@ObjectType()
export class RoomType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field()
  location: string;

  @Field()
  created_at: Date;

  @Field(() => [ReservationType])
  reservations: ReservationType[];
}

@InputType()
export class createRoomInput {
  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field()
  location: string;
}
