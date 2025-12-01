import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TasksGroupedByStatus } from "../../models/tasks/TasksGroupedByStatus";
import type { TaskEntityDto } from "../../models/tasks/TaskEntityDto";
import type { CreateTaskDto } from "../../models/tasks/CreateTaskDto";
import type { UpdateTaskDto } from "../../models/tasks/UpdateTaskDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { getTodaysTasks, getUpcomingTasks, updateTaskStatus, createTask, updateTask } from "../../services/tasksService";

interface TasksState {
    todayTasks: TasksGroupedByStatus;
    upcomingTasks: TaskEntityDto[];
    loading: boolean;
    error: string | null;
    isModalOpen: boolean;
    editingTask: TaskEntityDto | null;
}

const initialState: TasksState = {
    todayTasks: {
        Todo: [],
        InProgress: [],
        Done: []
    },
    upcomingTasks: [],
    loading: false,
    error: null,
    isModalOpen: false,
    editingTask: null,
};

// thunks
export const fetchTodayTasks = createAsyncThunk(
    'tasks/fetchTodayTasks',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getTodaysTasks();
            return result;
        } catch (error) {
            return rejectWithValue('Failed to fetch tasks');
        }
    }
);

export const fetchUpcomingTasks = createAsyncThunk(
    'tasks/fetchUpcomingTasks',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getUpcomingTasks();
            return result;
        } catch (error) {
            return rejectWithValue('Failed to fetch upcoming tasks');
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
            return rejectWithValue('Failed to update task status');
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (task: CreateTaskDto, { rejectWithValue }) => {
        try {
            const newTask = await createTask(task);
            return newTask;
        } catch (error) {
            return rejectWithValue('Failed to create task');
        }
    }
);

export const editTask = createAsyncThunk(
    'tasks/editTask',
    async (task: UpdateTaskDto, { rejectWithValue }) => {
        try {
            const updatedTask = await updateTask(task);
            return updatedTask;
        } catch (error) {
            return rejectWithValue('Failed to update task');
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        openCreateTaskModal: (state) => {
            state.isModalOpen = true;
            state.editingTask = null;
        },
        openEditTaskModal: (state, action: PayloadAction<TaskEntityDto>) => {
            state.isModalOpen = true;
            state.editingTask = action.payload;
        },
        closeTaskModal: (state) => {
            state.isModalOpen = false;
            state.editingTask = null;
        },
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

        // Fetch upcoming tasks
        builder.addCase(fetchUpcomingTasks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUpcomingTasks.fulfilled, (state, action: PayloadAction<TaskEntityDto[]>) => {
            state.loading = false;
            state.upcomingTasks = action.payload;
        });
        builder.addCase(fetchUpcomingTasks.rejected, (state, action) => {
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

        // Add task
        builder.addCase(addTask.fulfilled, (state, action) => {
            const newTask = action.payload;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Only add to today's tasks if it's for today or overdue
            if (!newTask.dueDate || new Date(newTask.dueDate) <= today) {
                const statusKey = TaskEntityStatus[newTask.status] as keyof TasksGroupedByStatus;
                state.todayTasks[statusKey].push(newTask);
            }
            state.isModalOpen = false;
            state.editingTask = null;
        });
        builder.addCase(addTask.rejected, (state, action) => {
            state.error = action.payload as string;
        });

        // Edit task
        builder.addCase(editTask.fulfilled, (state, action) => {
            const updatedTask = action.payload;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Update today's tasks
            const oldStatusKey = (Object.entries(state.todayTasks).find(([_, tasks]) =>
                tasks.some((t: TaskEntityDto) => t.id === updatedTask.id)
            )?.[0]) as keyof TasksGroupedByStatus | undefined;

            if (oldStatusKey) {
                state.todayTasks[oldStatusKey] = state.todayTasks[oldStatusKey].filter(t => t.id !== updatedTask.id);
                
                // Only add back to today's tasks if it's for today or overdue
                if (!updatedTask.dueDate || new Date(updatedTask.dueDate) <= today) {
                    const newStatusKey = TaskEntityStatus[updatedTask.status] as keyof TasksGroupedByStatus;
                    state.todayTasks[newStatusKey].push(updatedTask);
                }
            }
            
            // Update upcoming tasks
            const upcomingTaskIndex = state.upcomingTasks.findIndex(t => t.id === updatedTask.id);
            if (upcomingTaskIndex !== -1) {
                // Remove from upcoming tasks
                state.upcomingTasks = state.upcomingTasks.filter(t => t.id !== updatedTask.id);
                
                // Only add back if it's still an upcoming task (future date)
                if (updatedTask.dueDate && new Date(updatedTask.dueDate) >= tomorrow) {
                    state.upcomingTasks.push(updatedTask);
                }
            }
            state.isModalOpen = false;
            state.editingTask = null;
        });
        builder.addCase(editTask.rejected, (state, action) => {
            state.error = action.payload as string;
        });
    }
});

export const { clearError, openCreateTaskModal, openEditTaskModal, closeTaskModal } = tasksSlice.actions;
export default tasksSlice.reducer;
