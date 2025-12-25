import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: 'income' | 'expense';

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop()
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

