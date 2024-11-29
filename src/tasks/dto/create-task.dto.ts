import { IsEmpty, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Título não pode ultrapassar 100 caractéres' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Título não pode ultrapassar 500 caractéres' })
  description: string;

  @IsEmpty()
  completed: boolean;
}
