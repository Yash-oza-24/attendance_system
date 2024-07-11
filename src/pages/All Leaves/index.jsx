import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getAllLeaves } from "./Reducers/LeaveSilce";
import { useSelector } from "react-redux";
import LeaveList from "./LeaveList";
import EditRequestModel from "./EditRequestModel";
// import LeaveList from "./LeaveList";

const AllLeavesPage = () => {
  const { leaves } = useSelector((state) => state.leave);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllLeaves());
  }, []);
  return (
    <>
      <div>
        <ToastContainer />
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
            All Leaves
          </h4>
        </div>
      </div>
      <LeaveList leaves={leaves}  />
      <EditRequestModel/>
    </>
  );
};

export default AllLeavesPage;
