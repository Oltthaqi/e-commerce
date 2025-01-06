import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ChatStatus } from '../enums/ChatStatus.enum';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  roomId: number;

  @ManyToOne(() => User, { nullable: true, eager: true })
  sender: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  receiver: User;

  @Column('text')
  message: string;

  @CreateDateColumn()
  created_At: Date;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.OPEN,
  })
  status: ChatStatus;
}
