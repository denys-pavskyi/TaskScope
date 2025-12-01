import type { TaskEntityDto } from "./TaskEntityDto";

export interface TasksGroupedByStatus {
    Todo: TaskEntityDto[];
    InProgress: TaskEntityDto[];
    Done: TaskEntityDto[];
}