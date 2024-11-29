import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksService.getTasks();
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<string> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<string> {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<string> {
    return await this.tasksService.deleteTask(id);
  }
}
