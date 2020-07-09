import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly validStatuses = Object.keys(TaskStatus);

  transform(value: string, metadata: ArgumentMetadata): string {
    console.log('Metadata of Params Status Validation: ', metadata)
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}"is a invalid status`);
    }

    return value;
  }

  private isStatusValid(status: string) {
    return this.validStatuses.includes(status);
  }
}