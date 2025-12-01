import type { TaskEntityDto } from "../models/tasks/TaskEntityDto";
import type { TasksGroupedByStatus } from "../models/tasks/TasksGroupedByStatus";
import type { CreateTaskDto } from "../models/tasks/CreateTaskDto";
import type { UpdateTaskDto } from "../models/tasks/UpdateTaskDto";
import { TaskEntityStatus } from "../models/enums/TaskEntityStatus";
import { apiClient } from "./apiClient";

export async function getTodaysTasks(): Promise<TasksGroupedByStatus> {
    const response = await apiClient.get(`/Tasks/today`);
    return response.data;
}

export async function getUpcomingTasks(): Promise<TaskEntityDto[]> {
    const response = await apiClient.get(`/Tasks/upcoming`);
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

export async function createTask(task: CreateTaskDto): Promise<TaskEntityDto> {
    const response = await apiClient.post(`/Tasks`, task);
    return response.data;
}

export async function updateTask(task: UpdateTaskDto): Promise<TaskEntityDto> {
    const response = await apiClient.put(`/Tasks`, task);
    return response.data;
}

export async function getTaskById(taskId: string): Promise<TaskEntityDto> {
    const response = await apiClient.get(`/Tasks/${taskId}`);
    return response.data;
}

export async function deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`/Tasks`, {
        params: { taskId }
    });
}