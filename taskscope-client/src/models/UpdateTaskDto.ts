import { TaskEntityStatus } from "./enums/TaskEntityStatus";
import { TaskPriority } from "./enums/TaskPriority";

export interface UpdateTaskDto {
    id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskEntityStatus;
    dueDate?: string;
    completedAt?: string;
}
