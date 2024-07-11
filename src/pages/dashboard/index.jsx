import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import GroupChart2 from "@/components/partials/widget/chart/group-chart-2";
import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import SelectMonth from "@/components/partials/SelectMonth";
import CompanyTable from "@/components/partials/Table/company-table";
import HomeBredCurbs from "./HomeBredCurbs";
import { useSelector } from "react-redux";
import AttendanceList from "./AttendanceList";
import { getAllEmployee } from "../All Employees/Reducer/EmployeesSlice";
import { getAllBranches } from "../All Branch/Reducers/BranchSlice";
import { getAllUsers } from "../UserPage/Reducer/UserSlice";
import { useDispatch } from "react-redux";
import { getData } from "../Settings/Reducers/settingSlice";
import UserList from "./UserList";
import LeaveList from "../All Leaves/LeaveList"
import { getAllLeaves } from "../All Leaves/Reducers/LeaveSilce";

const Dashboard = () => {
  const role = useSelector((state) => state.user?.loggedInUser?.role);
  // const item = window.localStorage.getItem("USER");
  // const userData = JSON.parse(item);
  // const currentMonthAttendance = userData?.currentMonthAttendance || [];
  const {attendanceRecords} = useSelector((state) => state.attendance)
  const { users } = useSelector((state) => state.user);
  const { employee } = useSelector((state) => state.employee);
  const { branches } = useSelector((state) => state.branches);
  const { settings } = useSelector((state) => state.setting);
  const { leaves } = useSelector((state) => state.leave);
  const showComponent = role !== "employee";
  const dispatch = useDispatch();

  const [totalSalary, setTotalSalary] = useState("0.00");

  
  useEffect(() => {
    dispatch(getAllUsers("users"));
  }, []);

  useEffect(() => {
    dispatch(getAllEmployee("employee"));
  }, []);

  useEffect(() => {
    dispatch(getAllBranches("branches"));
  }, []);

  useEffect(() => {
    dispatch(getData());
  }, []);
  useEffect(() => {
    dispatch(getAllLeaves());
  }, []);

  const handleTotalSalaryChange = (salary) => {
    setTotalSalary(salary);
  };

  return (
    <div>
      <HomeBredCurbs title="Dashboard" />
      {showComponent && (
        <>
        <div className="grid grid-cols-12 gap-5 mb-5">
          <div className="2xl:col-span-12 lg:col-span-12 col-span-12">
            <Card bodyClass="p-4">
              <div className="grid md:grid-cols-3 col-span-1 gap-4">
                <GroupChart2
                  alluser={users}
                  allemployee={employee}
                  allbranches={branches}
                />
              </div>
            </Card>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
           
             <div> <UserList users={users} /></div>
             <div> <LeaveList leaves={leaves} /></div>

             
         
          </div>
          </>
      )}
      {!showComponent && (
        <>
          <GroupChart1 setting={settings} totalSalary={totalSalary} />
          <AttendanceList 
            data={attendanceRecords} 
            onTotalSalaryChange={handleTotalSalaryChange} 
          />
        </>
      )}
    
    </div>
  );
};

export default Dashboard;
