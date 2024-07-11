import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import leaveService from "./LeaveServices";
import { act } from "react";

// Thunks
export const createLeave = createAsyncThunk(
  "leave/create",
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await leaveService.createLeave(leaveData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllLeaves = createAsyncThunk(
  "leave/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveService.getAllLeaves();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPendingLeaves = createAsyncThunk(
  "leave/getPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveService.getPendingLeaves();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getLeaveById = createAsyncThunk(
  "leave/getById",
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await leaveService.getLeaveById(leaveId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLeave = createAsyncThunk(
  "leave/update",
  async ({ leaveId, leaveData }, { rejectWithValue }) => {
    console.log(leaveId)
    try {
      const response = await leaveService.updateLeave(leaveId, leaveData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveLeave = createAsyncThunk(
  "leave/approve",
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await leaveService.approveLeave(leaveId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectLeave = createAsyncThunk(
  "leave/reject",
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await leaveService.rejectLeave(leaveId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLeave = createAsyncThunk(
  "leave/delete",
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await leaveService.deleteLeave(leaveId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getemployeeLeave = createAsyncThunk(
  "leave/employee-leave",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await leaveService.getemployeeLeave(employeeId);

      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    leaveModal: false,
    editModel: false,
    leaveItem: {},
    status: "idle",
    error: null,
    editItem:{}
  },
  reducers: {
    toggleLeaveModal: (state, action) => {
      state.leaveModal = !state.leaveModal;
    },
    toggleEditLeaveModal: (state, action) => {
      state.editModel = !state.editModel;
      state.editItem = action.payload;
    },
    setLeaveItem: (state, action) => {
      state.leaveItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLeave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves.push(action.payload);
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllLeaves.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllLeaves.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves = action.payload;
      })
      .addCase(getAllLeaves.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getemployeeLeave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getemployeeLeave.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves = action.payload?.leaves
      })
      .addCase(getemployeeLeave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPendingLeaves.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPendingLeaves.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingLeaves = action.payload;
      })
      .addCase(getPendingLeaves.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getLeaveById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLeaveById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves = action.payload;
      })
      .addCase(getLeaveById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateLeave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.leaves.findIndex(
          (leave) => leave._id === action.payload._id
        );
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(approveLeave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.leaves.findIndex(
          (leave) => leave._id === action.payload._id
        );
        if (index !== -1) {
          state.leaves[index].status = "Approved";
        }
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(rejectLeave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.leaves.findIndex(
          (leave) => leave._id === action.payload._id
        );
        if (index !== -1) {
          state.leaves[index].status = "Rejected";
        }
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteLeave.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves = state.leaves.filter(
          (leave) => leave._id !== action.payload._id
        );
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { toggleLeaveModal, setLeaveItem , toggleEditLeaveModal} = leaveSlice.actions;
export default leaveSlice.reducer;
