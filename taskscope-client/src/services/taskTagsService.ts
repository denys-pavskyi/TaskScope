import type { CreateTaskEntityTagDto } from "../models/task-tags/CreateTaskEntityTagDto";
import { apiClient } from "./apiClient";

export async function addTagToTask(dto: CreateTaskEntityTagDto): Promise<void> {
    await apiClient.post(`/TaskEntityTag`, dto);
}

export async function removeTagFromTask(taskId: string, tagId: string): Promise<void> {
    await apiClient.delete(`/TaskEntityTag`, {
        params: {
            taskId,
            tagId
        }
    });
}
