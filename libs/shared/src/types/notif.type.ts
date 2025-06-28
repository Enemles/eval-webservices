import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ReservationType } from './reservation.type';

@ObjectType()
export class NotifType {
  @Field(() => ID)
  id: string;

  @Field({ name: 'reservation_id' })
  reservationId: string;

  @Field()
  message: string;

  @Field({ name: 'notification_date' })
  notificationDate: Date;

  @Field({ name: 'is_sent' })
  isSent: boolean;

  @Field(() => ReservationType)
  reservation: ReservationType;
}

@InputType()
export class createNotifInput {
  @Field({ name: 'reservation_id' })
  reservationId: string;

  @Field()
  message: string;

  @Field({ name: 'notification_date' })
  notificationDate: Date;

  @Field({ name: 'is_sent' })
  isSent: boolean;
}
