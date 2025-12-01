import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateTaskEntityTagDto } from "../../models/task-tags/CreateTaskEntityTagDto";
import { addTagToTask, removeTagFromTask } from "../../services/taskTagsService";
import { getTaskById } from "../../services/tasksService";

interface TaskTagsState {
    loading: boolean;
    error: string | null;
}

const initialState: TaskTagsState = {
    loading: false,
    error: null,
};

// Thunks
export const linkTagToTask = createAsyncThunk(
    'taskTags/linkTagToTask',
    async (dto: CreateTaskEntityTagDto, { rejectWithValue }) => {
        try {
            await addTagToTask(dto);
            const updatedTask = await getTaskById(dto.taskId);
            return { dto, updatedTask };
        } catch (error) {
            return rejectWithValue('Failed to link tag to task');
        }
    }
);

export const unlinkTagFromTask = createAsyncThunk(
    'taskTags/unlinkTagFromTask',
    async ({ taskId, tagId }: { taskId: string; tagId: string }, { rejectWithValue }) => {
        try {
            await removeTagFromTask(taskId, tagId);
            const updatedTask = await getTaskById(taskId);
            return { taskId, tagId, updatedTask };
        } catch (error) {
            return rejectWithValue('Failed to unlink tag from task');
        }
    }
);

const taskTagsSlice = createSlice({
    name: 'taskTags',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Link tag to task
        builder.addCase(linkTagToTask.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(linkTagToTask.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(linkTagToTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Unlink tag from task
        builder.addCase(unlinkTagFromTask.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(unlinkTagFromTask.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(unlinkTagFromTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearError } = taskTagsSlice.actions;
export default taskTagsSlice.reducer;
