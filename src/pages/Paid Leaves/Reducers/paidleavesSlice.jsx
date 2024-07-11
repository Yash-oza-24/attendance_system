import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paidleavesServices from "./paidleaveServices";
import { toast } from "react-toastify";

export const addpaidleave = createAsyncThunk(
  "paidleaves/Addpaidleave",
  async (data, thunkAPI) => {
    try {
      const response = await paidleavesServices.addPaidleave(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPaidleave = createAsyncThunk(
  "paidleaves/getpaidleaves",
  async (thunkAPI) => {
    try {
      const response = await paidleavesServices.getPaidleave();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPaidleavebyId = createAsyncThunk(
  "paidleaves/getpaidleavesById",
  async (userId, thunkAPI) => {
    try {
      const response = await paidleavesServices.getPaidleavebyId(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePaidleave = createAsyncThunk(
  "paidleaves/deletepaidleaves",
  async (userId, thunkAPI) => {
    try {
      const response = await paidleavesServices.deletePaidleave(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePaidleave = createAsyncThunk(
  "paidleaves/updatepaidleaves",
  async (data, thunkAPI) => {
    try {
      const response = await paidleavesServices.updatePaidleave(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const paidleavesSlice = createSlice({
  name: "paidleaves",
  initialState: {
    paidleaves: [],
    editItem: {},
    paidleavesItem: {},
    isLoading: false,
    addModel: false,
    editModel: false,
  },
  reducers: {
    toggleAddPaidLeaveModal: (state, action) => {
      state.addModel = !state.addModel;
    },
    toggleEditPaidLeaveModal: (state, action) => {
      state.editModel = !state.editModel;
      state.editItem = action.payload;
    },
    setPaidLeaveItem: (state, action) => {
      state.paidleavesItem = action.payload;
      state.editModel = !state.editModel;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addpaidleave.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addpaidleave.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(addpaidleave.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      .addCase(getPaidleave.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPaidleave.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paidleaves = action.payload;
        toast.success(action.payload.message);
      })
      .addCase(getPaidleave.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      .addCase(getPaidleavebyId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPaidleavebyId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paidleavesItem = action.payload;
        toast.success(action.payload.message);
      })
      .addCase(getPaidleavebyId.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      .addCase(deletePaidleave.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePaidleave.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(deletePaidleave.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      .addCase(updatePaidleave.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePaidleave.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(updatePaidleave.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      });
  },
});

export const {
  toggleAddPaidLeaveModal,
  toggleEditPaidLeaveModal,
  setPaidLeaveItem,
} = paidleavesSlice.actions;
export default paidleavesSlice.reducer;
