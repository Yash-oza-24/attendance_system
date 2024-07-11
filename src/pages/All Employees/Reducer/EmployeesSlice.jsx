import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EmployeeService from "../Reducer/EmployeesService";
import { toast } from "react-toastify";

// Async thunk for adding employee
export const addEmployee = createAsyncThunk(
    "employees/addEmployee",
    async (employeeData, thunkAPI) => {
        try {
            const response = await EmployeeService.addEmployee(employeeData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for employee login
export const employeeLogin = createAsyncThunk(
    "employees/employeeLogin",
    async (loginData, thunkAPI) => {
        try {
            const response = await EmployeeService.employeeLogin(loginData);
            if (response) {
                localStorage.setItem("loggedInEmployee", JSON.stringify(response));
            }
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for getting all employees
export const getAllEmployee = createAsyncThunk(
    "employees/getAllEmployee",
    async (thunkAPI) => {
        try {
            const response = await EmployeeService.getAllEmployee();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for deleting an employee
export const deleteEmployee = createAsyncThunk(
    "employees/deleteEmployee",
    async (userId, thunkAPI) => {
        try {
            const response = await EmployeeService.deleteEmployee(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for updating an employee
export const updateEmployee = createAsyncThunk(
    "employees/updateEmployee",
    async (employee, thunkAPI) => {
        try {
            const response = await EmployeeService.updateEmployee(employee);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (user, thunkAPI) => {
      try {
        const response = await EmployeeService.updateUser(user);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );

const employeeSlice = createSlice({
    name: "employee",
    initialState: {
        employee: [],
        loggedInEmployee: null,
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
            state.editItem = {}
        },
        editEmployee: (state, action) => {
            state.editItem = action.payload;
            state.editModal = !state.editModal;
        },
        editUserData: (state, action) => {
            state.editItem = action.payload;
            state.editModal = !state.editModal;
          },
        logoutEmployee: (state) => {
            state.loggedInEmployee = null;
            localStorage.removeItem("loggedInEmployee");
        },
        toggleDetailModal: (state, action) => {
            state.detailItem = action.payload;
            state.detailModal = !state.editModal;
        },
        closeDetailModal: (state, action) => {
            state.detailModal = action.payload;
            state.detailItem = {}
        },
    },
    extraReducers: (builder) => {
        builder
            //add
            .addCase(addEmployee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success(action.payload.message);
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.response?.data?.message);
            })
            // login
            .addCase(employeeLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(employeeLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loggedInEmployee = action.payload;
                toast.success(action.payload.message);
            })
            .addCase(employeeLogin.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.response?.data?.message);
            })
            //getall
            .addCase(getAllEmployee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.employee = action.payload;
                toast.success(action.payload.message);
            })
            .addCase(getAllEmployee.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.response?.data?.message);
            })
            //delete
            .addCase(deleteEmployee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                
                toast.success(action.payload.message);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload?.response?.data?.message);
            })
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
    logoutEmployee,
    editEmployee,
    editUserData
} = employeeSlice.actions;
export default employeeSlice.reducer;
