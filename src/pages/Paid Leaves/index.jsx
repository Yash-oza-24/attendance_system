import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import {
  getPaidleave,
  toggleAddPaidLeaveModal,
} from "./Reducers/paidleavesSlice";
import { useDispatch } from "react-redux";
import AddPaidLeave from "./AddPaidleave";
import { useSelector } from "react-redux";
import PaidLeaveList from "./PaidleaveList";
import EditPaidLeave from "./EditPaidLeave";

const PaidLeaves = () => {
  const { paidleaves } = useSelector((state) => state.paidleaves);
  const { loggedInUser } = useSelector((state) => state.user);
  const userRole =loggedInUser? loggedInUser.role : null;
  const { width, breakpoints } = useWidth();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPaidleave());
  }, []);
  return (
    <>
      <div>
        <ToastContainer />
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
            Paid Leaves
          </h4>
          <div
            className={`${
              width < breakpoints.md ? "space-x-rb" : ""
            } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
          >
            {userRole === "admin" && (
              <Button
                icon="heroicons-outline:plus"
                text="Add Paid Leave"
                className="btn-dark dark:bg-slate-700  h-min text-sm font-normal"
                iconClass=" text-lg"
                onClick={() => dispatch(toggleAddPaidLeaveModal(true))}
              />
            )}
          </div>
        </div>
      </div>
      <AddPaidLeave />
      <PaidLeaveList paidLeaves={paidleaves} />
      <EditPaidLeave />
    </>
  );
};

export default PaidLeaves;
