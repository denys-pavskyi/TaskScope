import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TasksGroupedByStatus } from "../../models/TasksGroupedByStatus";
import type { TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { getTodaysTasks, updateTaskStatus } from "../../services/tasksService";

interface TasksState {
    todayTasks: TasksGroupedByStatus;
    loading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    todayTasks: {
        Todo: [],
        InProgress: [],
        Done: []
    },
    loading: false,
    error: null
};

// thunks
export const fetchTodayTasks = createAsyncThunk(
    'tasks/fetchTodayTasks',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getTodaysTasks();
            return result;
        } catch (error) {
            // Error toast is shown automatically by apiClient interceptor
            return rejectWithValue('Failed to fetch tasks');
        }
    }
);

export const changeTaskStatus = createAsyncThunk(
    'tasks/changeTaskStatus',
    async ({ taskId, newStatus }: { taskId: string; newStatus: TaskEntityStatus }, { rejectWithValue }) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, newStatus);
            return { taskId, newStatus, updatedTask };
        } catch (error) {
            // Error toast is shown automatically by apiClient interceptor
            return rejectWithValue('Failed to update task status');
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodayTasks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTodayTasks.fulfilled, (state, action: PayloadAction<TasksGroupedByStatus>) => {
            state.loading = false;
            state.todayTasks = action.payload;
        });
        builder.addCase(fetchTodayTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Change task status
        builder.addCase(changeTaskStatus.pending, (state) => {
            state.error = null;
        });
        builder.addCase(changeTaskStatus.fulfilled, (state, action) => {
            const { taskId, newStatus, updatedTask } = action.payload;

            // Find and remove task from old status
            const oldStatusKey = (Object.entries(state.todayTasks).find(([_, tasks]) =>
                tasks.some((t: TaskEntityDto) => t.id === taskId)
            )?.[0]) as keyof TasksGroupedByStatus | undefined;

            if (oldStatusKey) {
                state.todayTasks[oldStatusKey] = state.todayTasks[oldStatusKey].filter(t => t.id !== taskId);
                
                // Add task to new status
                const newStatusKey = TaskEntityStatus[newStatus] as unknown as keyof TasksGroupedByStatus;
                state.todayTasks[newStatusKey].push(updatedTask);
            }
        });
        builder.addCase(changeTaskStatus.rejected, (state, action) => {
            state.error = action.payload as string;
        });
    }
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
