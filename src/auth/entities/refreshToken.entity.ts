import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RefreshToken')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  refreshToken: string;

  @Column()
  userId: string;

  @Column()
  expiryDate: Date;
}
