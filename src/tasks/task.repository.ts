import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../user/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filter: GetTaskFilterDto, user: User): Promise<Task[]>  {
    const { status, search } = filter;

    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if(status) {
      query.andWhere('task.status = :status', { status })
    }

    if(search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task: Task = this.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user
    });

    try {
      await task.save()
    } catch (error) {
      this.logger.error(`Failed to create a task for user ${user.username}`, error.stack);
    }

    delete task.user; // To not display the user node in the response
    return task;
  }
}