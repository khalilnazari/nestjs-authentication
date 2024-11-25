import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ForgetPasswordToken')
export class ForgetPasswordToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  userId: string;

  @Column()
  expiryDate: Date;
}
