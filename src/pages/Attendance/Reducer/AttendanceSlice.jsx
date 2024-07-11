import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AttendanceServices from "../Reducer/AttendanceServices";
import { toast } from "react-toastify";

// Async thunk for adding employee
export const addAttendance = createAsyncThunk(
  "attendance/addAttendance",
  async (attendanceData, thunkAPI) => {
    try {
      const response = await AttendanceServices.addAttendance(attendanceData);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async thunk for deleting an employee
export const deleteAttendance = createAsyncThunk(
  "attendance/deleteAttendance",
  async (attendanceId, thunkAPI) => {
    try {
      const response = await AttendanceServices.deleteAttendance(attendanceId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating an employee
export const updateAttendance = createAsyncThunk(
  "attendance/updateAttendance",
  async ({ userId, attendanceId, checkInTime, checkOutTime,  reason}, thunkAPI) => {

    
    try {
      const response = await AttendanceServices.updateAttendance(
        userId,
        attendanceId,
        checkInTime,
        checkOutTime,
        reason
        
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAttendance = createAsyncThunk(
  "attendance/getAttendance",
  async (userId, thunkAPI) => {
    try {
      const response = await AttendanceServices.getAttendance(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendanceRecords: [],
    isLoading: false,
    addModal: false,
    editModal: false,
    editItem: {},
    users: [],
  },
  reducers: {
    toggleAddModal: (state, action) => {
      state.addModal = action.payload;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
      state.editItem = {};
    },
    editattendace: (state, action) => {
      state.editItem = action.payload;
      state.editModal = !state.editModal;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add attendance
      .addCase(addAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceRecords.push(action.payload);
        toast.success("Attendance recorded successfully!");
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to record attendance.");
      })
      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editItem = action.payload;
        state.editModal = !state.editModal;
        toast.success(action.payload.message);
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceRecords = action.payload
        state.users = action.payload;
        toast.success(action.payload.message);
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      // Delete attendance
      .addCase(deleteAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Attendance deleted successfully!");
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message || "Failed to delete attendance.");
      });
  },
});

export const { toggleAddModal, toggleEditModal, setEditItem, editattendace } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
