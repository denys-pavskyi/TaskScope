import { TEST_USER } from "../consts/user";
import type { TaskEntityDto } from "../models/TaskEntityDto";
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