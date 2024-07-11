import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import dayjs from "dayjs";
import useWidth from "@/hooks/useWidth";
import AttendanceList from "./AttendanceList";
import EditAttendance from "./EditAttendance";
import AddAttendance from "./AddAttendance";
import { useDispatch } from "react-redux";
import { toggleAddModal, getAttendance } from "./Reducer/AttendanceSlice";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import Icon from "@/components/ui/Icon";
import {getData} from "../Settings/Reducers/settingSlice"

const AttendanceDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { width, breakpoints } = useWidth();
  const { user } = location.state || {};
  const attendanceListRef = useRef();
  const [csvData, setCsvData] = useState([]);

  const { users } = useSelector((state) => state.attendance);
  useEffect(()=>{
    dispatch(getData())
  } , [])
 
  useEffect(() => {
    if (id) {
      dispatch(getAttendance(id));
    }
  }, [dispatch, id]);

  const generateFilename = () => {
    const month = dayjs().format("MMMM");
    const username = user?.username || "user";
    return `${username}_${month}_attendance.csv`;
  };

  const handleExport = () => {
    const filteredData = attendanceListRef.current.getFilteredData();
    const totalDailyWorkingHours = filteredData.reduce(
      (total, row) => total + parseFloat(row.dailyWorkingHours || 0),
      0
    );
    const totalDailySalary = filteredData
      .reduce((total, row) => total + parseFloat(row.dailySalary || 0), 0)
      .toFixed(2);

    const dataToExport = filteredData.map(record => ({

      Date: dayjs(record.date).format('DD/MM/YYYY'),
      CheckInTime: dayjs(record.checkInTime).format('HH:mm'),
      CheckOutTime: dayjs(record.checkOutTime).format('HH:mm'),
      DailyWorkingHours: record.dailyWorkingHours,
      DailySalary: parseFloat(record.dailySalary).toFixed(2)
    }));

    // Append total working hours and total salary to the data
    dataToExport.push({
      "": "Total",
      Date: "",
      CheckInTime: "",
      CheckOutTime: "",
      DailyWorkingHours: totalDailyWorkingHours,
      DailySalary: totalDailySalary
    });

    setCsvData(dataToExport);
  };



  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Attendance
        </h4>
        <CSVLink
            data={csvData}
            filename={generateFilename()}
            className="btn btn-dark  dark:bg-slate-700 h-min text-sm font-normal ml-4"
            target="_blank"
            onClick={handleExport}
          >
            <div className="flex items-center">
              <Icon
                className="text-lg md:me-2"
                icon="heroicons-outline:archive-box-arrow-down"
              />
              <span className="hidden md:inline-block">CSV</span>
            </div>
          </CSVLink>
        <div
          className={`${
            width < breakpoints.md ? "space-x-rb" : ""
          } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
        >
         
          <Button
            icon="heroicons-outline:plus"
            text="Add Attendance"
            className="btn-dark dark:bg-slate-700 h-min text-sm font-normal"
            iconClass="text-lg"
            onClick={() => dispatch(toggleAddModal(true))}
          />
        </div>
      </div>
      <div className="grid-cols-6 gap-5">
        <Card className="capitalize xl:col-span-6 col-span-12 lg:col-span-5">
          <div className="flex md:grid-cols-2 grid-cols-1 gap-2">
            {user?.username}
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            {user?.email}
          </div>
        </Card>
      </div>
      <AttendanceList ref={attendanceListRef} data={users}  />
      <EditAttendance />
      <AddAttendance />
    </div>
  );
};

export default AttendanceDetailsPage;
