import { TaskEntityStatus } from "./enums/TaskEntityStatus";
import { TaskPriority } from "./enums/TaskPriority";
import type { TagDto } from "./TagDto";


export interface TaskEntityDto {
    id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskEntityStatus;
    dueDate?: string;
    completedAt?: string;
    tags: TagDto[];
}