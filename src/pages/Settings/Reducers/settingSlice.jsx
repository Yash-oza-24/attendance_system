import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import settingService from "./settingService";
import { toast } from "react-toastify";
import { act } from "react";

// Async thunks for handling API calls
export const adddata = createAsyncThunk(
    "settings/adddata",
    async (data, thunkAPI) => {
        try {
            const response = await settingService.addData(data);
            toast.success("Setting added successfully");
            return response;
        } catch (error) {
            toast.error("Failed to add setting");
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getData = createAsyncThunk(
    "settings/getData",
    async (_, thunkAPI) => {  // Note the underscore `_` since no argument is being passed
        try {
            const response = await settingService.getData();
            return response;
        } catch (error) {
            toast.error("Failed to fetch settings");
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateData = createAsyncThunk(
    "settings/updateData",
    async (data, thunkAPI) => {
        try {
            const response = await settingService.updateData({data});
            // toast.success("Setting updated successfully");
            return response;
        } catch (error) {
            toast.error("Failed to update setting");
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteData = createAsyncThunk(
    "settings/deleteData",
    async (data, thunkAPI) => {
        try {
            const response = await settingService.deleteData(data);
            toast.success("Setting deleted successfully");
            return response;
        } catch (error) {
            toast.error("Failed to delete setting");
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const settingSlice = createSlice({
    name: "setting",
    initialState: {
        settings: {},
        editItem: {},
        detailItem: {},
        isLoading: false,
        addModel: false,
        editModal: false,
        error: null,
    },
    reducers: {
        toggleAddModal: (state, action) => {
            state.addModel = action.payload;
        },
        toggleEditModal: (state, action) => {
            state.editModal = action.payload;
            state.editItem = {};
        },
        editSettingData: (state, action) => {
            console.log(action)
            state.editItem = action.payload;
            state.editModal = !state.editModal;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adddata.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adddata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings.push(action.payload);
            })
            .addCase(adddata.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings = action.payload;
                // console.log(action.payload)
            })
            .addCase(getData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateData.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success(action.payload.message);
            })
            .addCase(updateData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings = state.settings.filter((setting) => setting.id !== action.payload.id);
            })
            .addCase(deleteData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { toggleAddModal, toggleEditModal , editSettingData } = settingSlice.actions;
export default settingSlice.reducer;
