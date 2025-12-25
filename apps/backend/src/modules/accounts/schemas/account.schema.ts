import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
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

