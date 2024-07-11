import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BranchesService from "../Reducers/BranchServices";
import { toast } from "react-toastify";

// Async thunk for adding Branches
export const addBranches = createAsyncThunk(
  "Branchess/addBranches",
  async (BranchesData, thunkAPI) => {
    try {
      const response = await BranchesService.addBranches(BranchesData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for Branches login
export const BranchesLogin = createAsyncThunk(
  "Branchess/BranchesLogin",
  async (loginData, thunkAPI) => {
    try {
      const response = await BranchesService.BranchesLogin(loginData);
      if (response) {
        localStorage.setItem("loggedInBranches", JSON.stringify(response));
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting all Branchess
export const getAllBranches = createAsyncThunk(
  "Branchess/getAllBranches",
  async (thunkAPI) => {
    try {
      const response = await BranchesService.getAllBranches();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting an Branches
export const deleteBranches = createAsyncThunk(
  "Branchess/deleteBranches",
  async (userId, thunkAPI) => {
    try {
      const response = await BranchesService.deleteBranches(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating an Branches
export const updateBranches = createAsyncThunk(
  "Branchess/updateBranches",
  async (Branches, thunkAPI) => {
    try {
      const response = await BranchesService.updateBranches(Branches);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (user, thunkAPI) => {
    console.log(user)
    try {
      const response = await BranchesService.updateUser(user);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const BranchessSlice = createSlice({
  name: "branches",
  initialState: {
    branches: [],
    loggedInBranches: null,
    editItem: {},
    detailItem: {},
    isLoading: false,
    addModel: false,
    editModal: false,
  },
  reducers: {
    toggleAddModal: (state, action) => {
      state.addModel = action.payload;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
      state.editItem = {};
    },
    editUserData: (state, action) => {
      state.editItem = action.payload;
      state.editModal = !state.editModal;
    },
    editBranches: (state, action) => {
      state.editItem = action.payload;
      state.editModal = !state.editModal;
    },
    logoutBranches: (state) => {
      state.loggedInBranches = null;
      localStorage.removeItem("loggedInBranches");
    },
    toggleDetailModal: (state, action) => {
      state.detailItem = action.payload;
      state.detailModal = !state.editModal;
    },
    closeDetailModal: (state, action) => {
      state.detailModal = action.payload;
      state.detailItem = {};
    },
  },
  extraReducers: (builder) => {
    builder
      //add
      .addCase(addBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(addBranches.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      // login
      .addCase(BranchesLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(BranchesLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loggedInBranches = action.payload;
        toast.success(action.payload.message);
      })
      .addCase(BranchesLogin.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //getall
      .addCase(getAllBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload;
        toast.success(action.payload.message);
      })
      .addCase(getAllBranches.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //delete
      .addCase(deleteBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBranches.fulfilled, (state, action) => {
        state.isLoading = false;

        toast.success(action.payload.message);
      })
      .addCase(deleteBranches.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      })
      //updat
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.response?.data?.message);
      });
  },
});

export const {
  toggleAddModal,
  toggleEditModal,
  logoutBranches,
  editBranches,
  editUserData,
} = BranchessSlice.actions;
export default BranchessSlice.reducer;
