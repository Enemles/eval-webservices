import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { NotifType } from './notif.type';
import { RoomType } from './room.type';
import { UserType } from './user.type';

@ObjectType()
export class ReservationType {
  @Field(() => ID)
  id: string;

  @Field()
  user_id: string;

  @Field()
  room_id: string;

  @Field()
  start_time: Date;

  @Field()
  end_time: Date;

  @Field()
  created_at: Date;

  @Field()
  status: string;

  @Field(() => UserType)
  user: UserType;

  @Field(() => RoomType)
  room: RoomType;

  @Field(() => [NotifType])
  notifications: NotifType[];
}

@InputType()
export class createReservationInput {
  @Field()
  user_id: string;

  @Field()
  room_id: string;

  @Field()
  start_time: Date;

  @Field()
  end_time: Date;

  @Field()
  status: string;
}
