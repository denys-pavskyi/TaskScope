import { TEST_USER } from "../consts/user";
import type { TaskEntityDto } from "../models/TaskEntityDto";
import { TaskEntityStatus } from "../models/enums/TaskEntityStatus";
import { apiClient } from "./apiClient";

export async function getTasksForUser(startDate: string, endDate: string): Promise<TaskEntityDto[]> {
    const userId = TEST_USER.USER_DATA.ID;
    try {
        const response = await apiClient.get(`/Tasks/user/${userId}`, {
            params: { startDate, endDate },
        });

        return response.data ?? [];
    } catch (error) {
        console.error("Failed to fetch tasks", error);
        throw error;
    }
}

export async function updateTaskStatus(taskId: string, newStatus: TaskEntityStatus): Promise<TaskEntityDto> {
    try {
        const response = await apiClient.patch(`/Tasks/${taskId}/status`, {
            status: newStatus
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update task status", error);
        throw error;
    }
}