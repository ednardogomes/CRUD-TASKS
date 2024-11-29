import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Processor('tasks')
export class TaskProcessor {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  @Process('process-task')
  async handleTask(job: Job) {
    console.log(`Processing task: ${job.data.title}`);

    const task = await this.taskRepository.findOne({
      where: { id: job.data.id },
    });
    if (task) {
      task.completed = true;
      await this.taskRepository.save(task);
    }
  }
}
