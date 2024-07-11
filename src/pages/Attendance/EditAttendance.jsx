import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleEditModal,
  updateAttendance,
  getAttendance,
} from "./Reducer/AttendanceSlice";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import FormGroup from "@/components/ui/FormGroup";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import Textinput from "@/components/ui/Textinput";

const EditAttendance = () => {
  const { id } = useParams();
  const { editModal, editItem } = useSelector((state) => state.attendance);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const FormValidationSchema = yup.object().shape({
    date: yup.date().required("Date is required"),
    checkInTime: yup.string().required("Check-in time is required"),
    checkOutTime: yup.string().required("Check-out time is required"),
  });

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  useEffect(() => {
    if (editItem) {
      reset(editItem);
      setStartDate(new Date(editItem.date));
      const formattedCheckInTime = dayjs(editItem.checkInTime).format("HH:mm");
      const formattedCheckOutTime = dayjs(editItem.checkOutTime).format("HH:mm");
      setCheckInTime(formattedCheckInTime);
      setCheckOutTime(formattedCheckOutTime);
      reset({
        date: new Date(editItem.date),
        checkInTime: formattedCheckInTime,
        checkOutTime: formattedCheckOutTime,
        reason: editItem.reason,
      });
    }
  }, [editItem, reset]);

  const onSubmit = (data) => {
    const combinedCheckInTime = new Date(startDate);
    combinedCheckInTime.setHours(parseInt(data.checkInTime.split(":")[0], 10));
    combinedCheckInTime.setMinutes(
      parseInt(data.checkInTime.split(":")[1], 10)
    );

    const combinedCheckOutTime = new Date(startDate);
    combinedCheckOutTime.setHours(
      parseInt(data.checkOutTime.split(":")[0], 10)
    );
    combinedCheckOutTime.setMinutes(
      parseInt(data.checkOutTime.split(":")[1], 10)
    );

    dispatch(
      updateAttendance({
        reason: data.reason,
        userId: id,
        attendanceId: editItem._id,
        date: startDate,
        checkInTime: combinedCheckInTime,
        checkOutTime: combinedCheckOutTime,
      })
    );

    setTimeout(() => {
      dispatch(toggleEditModal(false));
      dispatch(getAttendance(id));
      reset();
    }, 500);

    toast.success("Edit Successful", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  return (
    <Modal
      title="Edit Attendance"
      labelclassName="btn-outline-dark"
      activeModal={editModal}
      onClose={() => dispatch(toggleEditModal(false))}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGroup error={errors.date}>
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Flatpickr
                className="form-control p-3.5 border leading-none rounded-lg"
                id="date"
                value={startDate}
                onChange={(date) => {
                  setStartDate(date[0]);
                  field.onChange(date[0]);
                }}
                options={{
                  altInput: true,
                  dateFormat: "Y-m-d",
                }}
              />
            )}
          />
          {errors.date && (
            <div className="mt-2 text-danger block text-sm">
              {errors.date.message}
            </div>
          )}
        </FormGroup>

        <FormGroup error={errors.checkInTime}>
          <label
            htmlFor="checkInTime"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Check In time:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Controller
              name="checkInTime"
              control={control}
              render={({ field }) => (
                <input
                  type="time"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...field}
                  value={checkInTime}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setCheckInTime(e.target.value);
                  }}
                  required
                />
              )}
            />
          </div>
          {errors.checkInTime && (
            <div className="mt-2 text-danger block text-sm">
              {errors.checkInTime.message}
            </div>
          )}
        </FormGroup>

        <FormGroup error={errors.checkOutTime}>
          <label
            htmlFor="checkOutTime"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Check Out time:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Controller
              name="checkOutTime"
              control={control}
              render={({ field }) => (
                <input
                  type="time"
                  id="checkOutTime"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...field}
                  value={checkOutTime}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setCheckOutTime(e.target.value);
                  }}
                  required
                />
              )}
            />
          </div>
          {errors.checkOutTime && (
            <div className="mt-2 text-danger block text-sm">
              {errors.checkOutTime.message}
            </div>
          )}
        </FormGroup>

        <Textinput
          name="reason"
          label="Reason"
          type="text"
          placeholder="Reason"
          register={register}
          defaultValue={editItem ? editItem.reason : ""}
          error={errors.reason}
        />

        <div className="text-right">
          <button type="submit" className="btn btn-dark">
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAttendance;
