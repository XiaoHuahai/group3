import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/enums/role.enum.js';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: [String], enum: Role, default: [Role.Submitter] })
  roles!: Role[];

  @Prop({ type: String })
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  versionKey: false,
  transform: (_: any, ret: any) => {
    delete ret.passwordHash;
    return ret;
  }
});

