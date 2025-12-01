import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TagDto } from "../../models/TagDto";
import type { CreateTagDto } from "../../models/CreateTagDto";
import type { UpdateTagDto } from "../../models/UpdateTagDto";
import { getTags, createTag, updateTag, deleteTag } from "../../services/tagsService";

interface TagsState {
    tags: TagDto[];
    loading: boolean;
    error: string | null;
}

const initialState: TagsState = {
    tags: [],
    loading: false,
    error: null
};

// Thunks
export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getTags();
            return result;
        } catch (error) {
            return rejectWithValue('Failed to fetch tags');
        }
    }
);

export const addTag = createAsyncThunk(
    'tags/addTag',
    async (tag: CreateTagDto, { rejectWithValue }) => {
        try {
            const newTag = await createTag(tag);
            return newTag;
        } catch (error) {
            return rejectWithValue('Failed to create tag');
        }
    }
);

export const editTag = createAsyncThunk(
    'tags/editTag',
    async (tag: UpdateTagDto, { rejectWithValue }) => {
        try {
            const updatedTag = await updateTag(tag);
            return updatedTag;
        } catch (error) {
            return rejectWithValue('Failed to update tag');
        }
    }
);

export const removeTag = createAsyncThunk(
    'tags/removeTag',
    async (tagId: string, { rejectWithValue }) => {
        try {
            await deleteTag(tagId);
            return tagId;
        } catch (error) {
            return rejectWithValue('Failed to delete tag');
        }
    }
);

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch tags
        builder.addCase(fetchTags.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTags.fulfilled, (state, action: PayloadAction<TagDto[]>) => {
            state.loading = false;
            state.tags = action.payload;
        });
        builder.addCase(fetchTags.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Add tag
        builder.addCase(addTag.pending, (state) => {
            state.error = null;
        });
        builder.addCase(addTag.fulfilled, (state, action: PayloadAction<TagDto>) => {
            state.tags.push(action.payload);
        });
        builder.addCase(addTag.rejected, (state, action) => {
            state.error = action.payload as string;
        });

        // Edit tag
        builder.addCase(editTag.pending, (state) => {
            state.error = null;
        });
        builder.addCase(editTag.fulfilled, (state, action: PayloadAction<TagDto>) => {
            const index = state.tags.findIndex(tag => tag.id === action.payload.id);
            if (index !== -1) {
                state.tags[index] = action.payload;
            }
        });
        builder.addCase(editTag.rejected, (state, action) => {
            state.error = action.payload as string;
        });

        // Remove tag
        builder.addCase(removeTag.pending, (state) => {
            state.error = null;
        });
        builder.addCase(removeTag.fulfilled, (state, action: PayloadAction<string>) => {
            state.tags = state.tags.filter(tag => tag.id !== action.payload);
        });
        builder.addCase(removeTag.rejected, (state, action) => {
            state.error = action.payload as string;
        });
    }
});

export const { clearError } = tagsSlice.actions;
export default tagsSlice.reducer;
