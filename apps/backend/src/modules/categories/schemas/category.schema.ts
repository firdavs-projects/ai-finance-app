import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

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
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: 'income' | 'expense';

  @Prop()
  icon?: string;

  @Prop()
  color?: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

