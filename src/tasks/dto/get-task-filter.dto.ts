import { TaskStatus } from "../task.model";
import { IsIn, IsOptional, IsNotEmpty } from "class-validator";

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}