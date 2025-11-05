import { TEST_USER } from "../consts/user";
import type { TaskEntityDto } from "../models/TaskEntityDto";
import type { TasksGroupedByStatus } from "../models/TasksGroupedByStatus";
import { TaskEntityStatus } from "../models/enums/TaskEntityStatus";
import { apiClient } from "./apiClient";

export async function getTodaysTasks(): Promise<TasksGroupedByStatus> {
    const userId = TEST_USER.USER_DATA.ID;
    try {
        const response = await apiClient.get(`/Tasks/today/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch today's tasks", error);
        throw error;
    }
}

export async function updateTaskStatus(taskId: string, newStatus: TaskEntityStatus): Promise<TaskEntityDto> {
    try {
        const response = await apiClient.patch(`/Tasks/updateStatus`, null, {
            params: {
                taskId,
                newStatus
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update task status", error);
        throw error;
    }
}