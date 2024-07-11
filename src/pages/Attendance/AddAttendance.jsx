import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleAddModal,
  addAttendance,
  getAttendance,
} from "./Reducer/AttendanceSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "@/components/ui/FormGroup";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";
import Textinput from "@/components/ui/Textinput";

const AddAttendance = () => {
  const { addModal } = useSelector((state) => state.attendance);
  const [startDate, setStartDate] = useState(new Date());
  const dispatch = useDispatch();
  const { id } = useParams();
  const FormValidationSchema = yup
    .object({
      checkInTime: yup.string().required("Check-in time is required"),
      checkOutTime: yup.string().required("Check-out time is required"),
      reason : yup.string().required("Reason Is Required")
    })
    .required();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    const currentDate = dayjs(data.date).format("YYYY-MM-DD");
    const attendance = {
      date: currentDate,
      reason: data.reason,
      userId: id,
      checkInTime: dayjs(`${currentDate}T${data.checkInTime}`).toISOString(),
      checkOutTime: dayjs(`${currentDate}T${data.checkOutTime}`).toISOString(),
    };
    console.log(attendance);
    dispatch(addAttendance(attendance)).catch((errorMessage) =>
      toast.danger(errorMessage)
    );
    setTimeout(() => {
      dispatch(getAttendance(id));
    }, 500);
    dispatch(toggleAddModal(false));
    reset();
  };

  return (
    <div>
      <Modal
        title="Add Attendance"
        labelclassName="btn-outline-dark"
        activeModal={addModal}
        onClose={() => dispatch(toggleAddModal(false))}
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
                  className="form-control p-3.5  border leading-none rounded-lg "
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
              for="time"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Check In time:
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="time"
                id="time"
                class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("checkInTime")}
                required
              />
            </div>
            {errors.checkInTime && (
              <div className="mt-2 text-danger-500 block text-sm">
                {errors.checkInTime.message}
              </div>
            )}
          </FormGroup>

          <FormGroup error={errors.checkOutTime}>
            <label
              for="time"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Check Out time:
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="time"
                id="time"
                class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("checkOutTime")}
                required
              />
            </div>
            {errors.checkOutTime && (
              <div className="mt-2 text-danger-500 block text-sm">
                {errors.checkOutTime.message}
              </div>
            )}
          </FormGroup>
          <Textinput
            name="reason"
            label="Reason"
            type="text"
            placeholder="Enter Reason"
            register={register}
            error={errors.reason?.message}
            className="h-[48px] bg-gray-50 border leading-none border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
          <div className="ltr:text-right rtl:text-left">
            <button type="submit" className="btn btn-dark text-center">
              Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddAttendance;
