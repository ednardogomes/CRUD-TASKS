import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @Column({ default: false })
  completed: boolean;
}
