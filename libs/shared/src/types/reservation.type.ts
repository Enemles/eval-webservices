import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { NotifType } from './notif.type';
import { RoomType } from './room.type';
import { UserType } from './user.type';

@ObjectType()
export class ReservationType {
  @Field(() => ID)
  id: string;

  @Field({ name: 'user_id' })
  userId: string;

  @Field({ name: 'room_id' })
  roomId: string;

  @Field({ name: 'start_time' })
  startTime: Date;

  @Field({ name: 'end_time' })
  endTime: Date;

  @Field({ name: 'created_at' })
  createdAt: Date;

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
  userId: string;

  @Field()
  roomId: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  status: string;
}
