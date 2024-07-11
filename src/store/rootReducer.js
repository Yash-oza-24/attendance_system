import layout from "./layout";
import todo from "../pages/app/todo/store";
import email from "../pages/app/email/store";
import chat from "../pages/app/chat/store";
import kanban from "../pages/app/kanban/store";
import calendar from "../pages/app/calender/store";
import auth from "../pages/auth/common/store";
import employee from "../pages/All Employees/Reducer/EmployeesSlice"
import user from "../pages/UserPage/Reducer/UserSlice"
import branches from "../pages/All Branch/Reducers/BranchSlice"
import attendance from "../pages/Attendance/Reducer/AttendanceSlice"
import leave from "../pages/All Leaves/Reducers/LeaveSilce"
import setting from "../pages/Settings/Reducers/settingSlice";
import paidleaves from "../pages/Paid Leaves/Reducers/paidleavesSlice";

const rootReducer = {
  branches,
  employee,
  user,
  layout,
  todo,
  email,
  chat,
  attendance,
  kanban,
  calendar,
  auth,
  leave,
  setting,
  paidleaves
};
export default rootReducer;
