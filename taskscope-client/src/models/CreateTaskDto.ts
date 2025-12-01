import { TaskEntityStatus } from "./enums/TaskEntityStatus";
import { TaskPriority } from "./enums/TaskPriority";

export interface CreateTaskDto {
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskEntityStatus;
    dueDate?: string;
}
