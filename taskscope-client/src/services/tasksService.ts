import type { TaskEntityDto } from "../models/TaskEntityDto";
import type { TasksGroupedByStatus } from "../models/TasksGroupedByStatus";
import { TaskEntityStatus } from "../models/enums/TaskEntityStatus";
import { apiClient } from "./apiClient";

export async function getTodaysTasks(): Promise<TasksGroupedByStatus> {
    const response = await apiClient.get(`/Tasks/today`);
    return response.data;
}

export async function updateTaskStatus(taskId: string, newStatus: TaskEntityStatus): Promise<TaskEntityDto> {
    const response = await apiClient.patch(`/Tasks/updateStatus`, null, {
        params: {
            taskId,
            newStatus
        }
    });
    return response.data;
}