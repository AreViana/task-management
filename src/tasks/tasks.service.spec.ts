import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 1, username: 'Arely' };
const mockTask = { title: 'Test task', description: 'Test desc' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('get tasks', () => {
    it('gets all tasks from the repository', async() => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      taskRepository.getTasks.mockResolvedValue([mockTask]);
      const filters: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some title' };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual([mockTask]);
    });
  });

  describe('get task by id', () => {
    it('calss taskRepository.findOne() and return the task', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskbyId(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id }
      });
    });

    it('throw an error when task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskbyId(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create task', () => {
    it('calls taskRepository.createTask() and returns the task', async () => {
      taskRepository.createTask.mockResolvedValue(mockTask);
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('delete task', () => {
    it('calls taskRepository.delete() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTaskbyId(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalled();
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1, userId: mockUser.id
      });
    });
  
    it('throw an error when task is not found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTaskbyId(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('change task status', () => {
    it('update a task status and return the task', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tasksService.getTaskbyId = jest.fn();

      tasksService.getTaskbyId.mockResolvedValue({
        status: TaskStatus.OPEN,
        save
      });

      // TODO: Fix tests
      //expect(tasksService.getTaskById).not.toHaveBeenCalled();
      //expect(save).not.toHaveBeenCalled();
      // const result = await tasksService.changeTaskStatus(1, TaskStatus.DONE, mockUser);
      // expect(tasksService.getTaskById).toHaveBeenCalled();
      // expect(save).toHaveBeenCalled();
      // expect(result.status).toEqual(TaskStatus.DONE);
    });
  })
});