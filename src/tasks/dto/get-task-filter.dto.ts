import { IsIn, IsOptional, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}