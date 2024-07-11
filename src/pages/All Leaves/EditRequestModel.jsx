import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import * as yup from "yup";
import Flatpickr from "react-flatpickr";
import {  getAllLeaves, getemployeeLeave, toggleEditLeaveModal, updateLeave } from "./Reducers/LeaveSilce";

const leaveTypeOptions = [
  { value: "Personal", label: "Personal" },
  { value: "Other", label: "Other" },
  { value: "Sick", label: "Sick" },
  { value: "Vacation", label: "Vacation" },
];

const shiftOptions = [
  { value: "First Shift", label: "First Shift" },
  { value: "Second Shift", label: "Second Shift" },
  { value: "Full Day", label: "Full Day" },
];

const styles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const EditRequestModel = () => {
  const { editModel, editItem } = useSelector((state) => state.leave);
  const { loggedInUser, users } = useSelector((state) => state.user);
  const [selectedUserMobile, setSelectedUserMobile] = useState("");
  const [selectedUserBranch, setSelectedUserBranch] = useState("");
  const dispatch = useDispatch();

  const allUserOptions = users.map((user) => ({
    value: user.username,
    label: user.username,
    mobileno: user.mobile,
    branch: user.branch,
  }));

  const FormValidationSchema = yup.object({
    dateRange: yup.array().of(yup.date()).required("Date range is required"),
    reason: yup.string().required("Reason is required"),
    leaveType: yup.object().required("Leave type is required"),
    shift: yup.object().required("Shift is required"),
  });

  const { register, control, reset, formState: { errors }, handleSubmit, setValue } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  useEffect(() => {
    reset(editItem);
    if (editItem?.leaveType) {
      setValue("leaveType", leaveTypeOptions.find((option) => option.value === editItem.leaveType));
    }
    if (editItem?.shift) {
      setValue("shift", shiftOptions.find((option) => option.value === editItem.shift));
    }
  }, [editItem]);

  const onSubmit = (data) => {
    const [startDate, endDate] = data.dateRange;
    const leaveId = editItem._id
    console.log(leaveId)
    const leaveData = {
      ...data,
      leaveType: data.leaveType.value,
      shift: data.shift.value,
      employeeName: editItem.employeeName,
      employeeMobileno: editItem.employeeMobileno,
      startDate,
      endDate,
      branch: selectedUserBranch,
    };

    dispatch(updateLeave({leaveId,leaveData}));
    setTimeout(() => {
      dispatch(toggleEditLeaveModal(false));
      if (loggedInUser.role === "employee") {
        dispatch(getemployeeLeave(loggedInUser.username));
      }
      else{
        dispatch(getAllLeaves())
      }
      reset();
    }, 500);
  };

  useEffect(() => {
    // console.log("editModel state changed:", editModel);
  }, [editModel]);

  return (
    <div>
      <Modal
        title="Leave Request"
        labelclassName="btn-outline-dark"
        activeModal={editModel}
        onClose={() => dispatch(toggleEditLeaveModal(false))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {loggedInUser.role === "branchAdmin" && (
            <div>
              <label htmlFor="selectedUser" className="form-label">Select User</label>
              <Controller
                name="selectedUser"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    id="selectedUser"
                    className="react-select"
                    classNamePrefix="select"
                    options={allUserOptions}
                    onChange={(option) => {
                      field.onChange(option);
                      setSelectedUserMobile(option.mobileno);
                      setSelectedUserBranch(option.branch);
                    }}
                    styles={styles}
                  />
                )}
              />
              {errors.selectedUser && (
                <span className="text-red-500">{errors.selectedUser.message}</span>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
            <div className="relative">
              <label htmlFor="dateRange" className="form-label">Date Range</label>
              <Controller
                name="dateRange"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    id="dateRange"
                    className="form-control py-2"
                    options={{
                      mode: "range",
                      dateFormat: "Y-m-d",
                      minDate: "today",
                      defaultDate: ["YYYY-MM-DD", "YYYY-MM-DD"],
                    }}
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholder="YYYY-MM-DD - YYYY-MM-DD"
                  />
                )}
              />
              {errors.dateRange && (
                <span className="text-red-500">{errors.dateRange.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="shift" className="form-label">Shift</label>
              <Controller
                name="shift"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    id="shift"
                    className="react-select"
                    classNamePrefix="select"
                    options={shiftOptions}
                    {...field}
                    styles={styles}
                  />
                )}
              />
              {errors.shift && (
                <span className="text-red-500">{errors.shift.message}</span>
              )}
            </div>
          </div>

          <Textinput
            name="reason"
            label="Reason"
            type="text"
            placeholder="Enter reason"
            register={register}
            defaultValue={editItem?.reason}
            error={errors.reason}
            className="h-[48px]"
          />
          <div>
            <label htmlFor="leaveType" className="form-label">Leave Type</label>
            <Controller
              name="leaveType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  id="leaveType"
                  className="react-select"
                  classNamePrefix="select"
                  options={leaveTypeOptions}
                  {...field}
                  styles={styles}
                />
              )}
            />
            {errors.leaveType && (
              <span className="text-red-500">{errors.leaveType.message}</span>
            )}
          </div>
          <Textinput
            name="comments"
            label="Comments"
            type="text"
            placeholder="Enter comments (optional)"
            register={register}
            defaultValue={editItem?.comments}
            error={errors.comments}
            className="h-[48px]"
          />
          <button className="btn btn-dark block w-full text-center">
            Update Leave Request
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EditRequestModel;
