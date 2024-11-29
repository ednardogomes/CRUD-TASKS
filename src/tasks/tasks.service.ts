import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { validate as isValidUUID } from 'uuid';

import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectQueue('tasks')
    private readonly taskQueue: Queue,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<string> {
    try {
      const newTaskDb = new Task();
      newTaskDb.id = uuid();
      newTaskDb.title = createTaskDto.title;
      newTaskDb.description = createTaskDto.description;
      await this.taskRepository.save(newTaskDb);
      await this.taskQueue.add('process-task', newTaskDb);
      return 'Tarefa criada com sucesso';
    } catch (error) {
      throw new BadRequestException(
        `Ocorreu um erro ao criar a tarefa ${error.message}`,
      );
    }
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    try {
      if (!isValidUUID(id)) {
        throw new BadRequestException('Insira um ID válido');
      }

      if (!foundTask) {
        throw new NotFoundException('Tarefa não encontrada.!');
      }

      return foundTask;
    } catch (error) {
      throw new BadRequestException(`Erro inesperado.!${error.message}`);
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<string> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    try {
      if (!isValidUUID(id)) {
        throw new BadRequestException('Insira um ID válido');
      }

      if (!foundTask) {
        throw new NotFoundException('Tarefa não encontrada.!');
      }

      await this.taskRepository.update(id, updateTaskDto);
      Object.assign(foundTask, updateTaskDto);
      return 'Tarefa atualizada com sucesso';
    } catch (error) {
      throw new BadRequestException(`Erro inesperado ${error.message}`);
    }
  }

  async deleteTask(id: string): Promise<string> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    try {
      if (!isValidUUID(id)) {
        throw new BadRequestException('Insira um ID válido');
      } else if (!foundTask) {
        throw new NotFoundException('Tarefa não encontrada.!');
      }

      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException('Task not found');
      return 'Tarefa removida com sucesso';
    } catch (error) {
      throw new BadRequestException(`Erro inesperado.!${error.message}`);
    }
  }
}
