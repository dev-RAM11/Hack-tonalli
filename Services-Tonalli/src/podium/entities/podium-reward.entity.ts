import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('podium_rewards')
export class PodiumReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  week: string;

  @Column()
  position: number; // 1, 2, 3

  @Column()
  rewardUsd: number; // 15, 10, 5

  @Column({ nullable: true })
  rewardXlm: string;

  @Column({ nullable: true })
  txHash: string;

  @Column({ nullable: true })
  nftTxHash: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'retained' | 'reassigned';

  // If user has no wallet, retain for 7 days
  @Column({ nullable: true })
  retainedUntil: Date;

  @CreateDateColumn()
  createdAt: Date;
}
