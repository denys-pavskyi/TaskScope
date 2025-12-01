import type { TagDto } from "../models/tags/TagDto";
import type { CreateTagDto } from "../models/tags/CreateTagDto";
import type { UpdateTagDto } from "../models/tags/UpdateTagDto";
import { apiClient } from "./apiClient";

export async function getTags(): Promise<TagDto[]> {
    const response = await apiClient.get(`/Tag`);
    return response.data;
}

export async function createTag(tag: CreateTagDto): Promise<TagDto> {
    const response = await apiClient.post(`/Tag`, tag);
    return response.data;
}

export async function updateTag(tag: UpdateTagDto): Promise<TagDto> {
    const response = await apiClient.put(`/Tag`, tag);
    return response.data;
}

export async function deleteTag(tagId: string): Promise<void> {
    await apiClient.delete(`/Tag`, {
        params: {
            tagId: tagId
        }
    });
}
