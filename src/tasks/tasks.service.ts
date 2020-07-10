import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
    ) {}

  // getTasks(filter: GetTaskFilterDto): Task[] {
  //   const { status, search } = filter;

  //   let tasks = this.getAllTasks();
    

  //   if(status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }

  //   if(search) {
  //     tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
  //   }
  //   return tasks;
  // }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskbyId(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskbyId(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
  }

  async changeTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskbyId(id);
    task.status = status;
    await task.save();
    return task;
  }
}
