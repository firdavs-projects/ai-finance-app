import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // Преобразование ObjectId в строки для внешних ключей
      if (ret.categoryId) ret.categoryId = ret.categoryId.toString();
      if (ret.accountId) ret.accountId = ret.accountId.toString();
      if (ret.accountToId) ret.accountToId = ret.accountToId.toString();
      return ret;
    },
  },
})
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: 'income' | 'expense' | 'transfer' | 'debt';

  @Prop({ default: 'TJS' })
  currency?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account' })
  accountToId?: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop()
  place?: string;

  @Prop()
  person?: string;

  @Prop()
  comment?: string;

  @Prop()
  debtSubType?: 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned';

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop()
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

