import { GameType } from 'src/utils/types';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'match' })
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.wins)
  @JoinColumn()
  winner: User;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'match_loser_user',
    joinColumn: { name: 'match_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  loser: User[];

  @Column()
  winnerPseudo: string;

  @Column()
  p1: string;

  @Column()
  p2: string;

  @Column({ nullable: true })
  p3: string;

  @Column({ nullable: true })
  p4: string;

  @Column()
  scoreP1: number;

  @Column()
  scoreP2: number;

  @Column({ nullable: true })
  scoreP3: number;

  @Column({ nullable: true })
  scoreP4: number;

  @Column()
  gameType: GameType;

  @Column({ default: new Date() })
  createdAt: Date;
}
