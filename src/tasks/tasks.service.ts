import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuidv1 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(filter: GetTaskFilterDto): Task[] {
    const { status, search } = filter;

    let tasks = this.getAllTasks();
    

    if(status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if(search) {
      tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
    }
    return tasks;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskbyId(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv1(),
      title,
      description,
      status: TaskStatus.OPEN
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskbyId(id: string): void {
    //const task = this.tasks.find(task => task.id === id);
    //const index = this.tasks.indexOf(task);
    //delete this.tasks[index];
    //this.tasks.splice(index,1)[0];
    const found = this.getTaskbyId(id); // To throw the exception
    this.tasks.filter(task => task.id !== found.id);
  }

  changeTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskbyId(id);
    task.status = status;
    return task;
  }
}
