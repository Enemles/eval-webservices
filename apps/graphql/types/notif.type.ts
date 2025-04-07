import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ReservationType } from './reservation.type';

@ObjectType()
export class NotifType {
  @Field(() => ID)
  id: string;

  @Field()
  reservation_id: string;

  @Field()
  message: string;

  @Field()
  notification_date: Date;

  @Field()
  is_sent: boolean;

  @Field(() => ReservationType)
  reservation: ReservationType;
}

@InputType()
export class createNotifInput {
  @Field()
  reservation_id: string;

  @Field()
  message: string;

  @Field()
  notification_date: Date;

  @Field()
  is_sent: boolean;
}
