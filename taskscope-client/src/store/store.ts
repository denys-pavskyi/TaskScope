import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import tagsReducer from "./slices/tagsSlice";
import taskTagsReducer from "./slices/taskTagsSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    tags: tagsReducer,
    taskTags: taskTagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
