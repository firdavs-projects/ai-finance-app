import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop()
  currency: string;

  @Prop()
  type?: string;

  @Prop()
  icon?: string;

  @Prop()
  color?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

