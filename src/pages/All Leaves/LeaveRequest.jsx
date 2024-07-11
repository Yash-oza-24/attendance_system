import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import LeaveRequestModel from "./RequestModel";
import {
  getAllLeaves,
  getemployeeLeave,
  toggleLeaveModal,
} from "./Reducers/LeaveSilce";
import { useDispatch } from "react-redux";
import LeaveList from "./LeaveList";
import { useSelector } from "react-redux";
import EditRequestModel from "./EditRequestModel";
import { getAllUsers } from "../UserPage/Reducer/UserSlice";
const LeaveRequest = () => {
  const [filler, setfiller] = useState("list");
  const [isLoaded, setIsLoaded] = useState(false);
  const { leaves } = useSelector((state) => state.leave);
  const { width, breakpoints } = useWidth();
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    {
      loggedInUser.role === "employee" &&
        dispatch(getemployeeLeave(loggedInUser.username));
    }
  }, []);
  useEffect(() => {
    {
      loggedInUser.role === "branchAdmin" && dispatch(getAllUsers());
    }
  }, []);
  useEffect(() => {
    dispatch(getAllLeaves());
  }, []);
  return (
    <>
      <div>
        <ToastContainer />
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
            Leave Request
          </h4>
          <div
            className={`${
              width < breakpoints.md ? "space-x-rb" : ""
            } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
          >
            <Button
              icon="heroicons-outline:plus"
              text="Add Leave Request"
              className="btn-dark dark:bg-slate-700  h-min text-sm font-normal"
              iconClass=" text-lg"
              onClick={() => dispatch(toggleLeaveModal(true))}
            />
          </div>
        </div>
      </div>
      {isLoaded && filler === "list" && <TableLoading count={leaves?.length} />}
      {filler === "list" && !isLoaded && (
        <div>
          <LeaveList leaves={leaves} />
        </div>
      )}
      <LeaveRequestModel />
      <EditRequestModel />
    </>
  );
};

export default LeaveRequest;
