import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('acta_certificates')
export class ActaCertificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  chapterId: string;

  @Column()
  chapterTitle: string;

  // ACTA VC ID (e.g. "vc:tonalli:chapter:uuid:timestamp")
  @Column({ nullable: true })
  actaVcId: string;

  // Stellar transaction hash from ACTA issuance
  @Column({ nullable: true })
  txHash: string;

  @Column()
  examScore: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'issued' | 'failed';

  // 'official' = paid/premium, 'achievement' = free 75% image
  @Column({ default: 'official' })
  type: 'official' | 'achievement';

  @CreateDateColumn()
  issuedAt: Date;
}
