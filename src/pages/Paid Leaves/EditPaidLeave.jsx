import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  getPaidleave,
  toggleEditPaidLeaveModal,
  updatePaidleave,
} from "./Reducers/paidleavesSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "@/components/ui/FormGroup";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";
import Textinput from "@/components/ui/Textinput";
import ToggleButton from "react-toggle-button";

const EditPaidLeave = () => {
  const { editModel, paidleavesItem } = useSelector(
    (state) => state.paidleaves
  );
  const [startDate, setStartDate] = useState(new Date());
  const [isPaid, setIsPaid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (paidleavesItem) {   
      setStartDate(dayjs(paidleavesItem.date).toDate());
      setIsPaid(paidleavesItem.isPaid === "paid");
      reset({
        date: dayjs(paidleavesItem.date).toDate(),
        reason: paidleavesItem.reason,
      });
    }
  }, [paidleavesItem]);

  const FormValidationSchema = yup
    .object({
      date: yup.date().required("Date is required"),
      reason: yup.string().required("Reason is required"),
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
    const paidLeave = {
      id: paidleavesItem._id, // Assuming 'id' is the unique identifier
      date: currentDate,
      reason: data.reason,
      isPaid: isPaid ? "paid" : "unpaid",
    };
    dispatch(updatePaidleave(paidLeave)).catch((errorMessage) =>
      toast.error(errorMessage)
    );

    dispatch(getPaidleave());
    dispatch(toggleEditPaidLeaveModal(false));
    reset();
  };

  return (
    <div>
      <Modal
        title="Edit Paid Leave"
        labelclassName="btn-outline-dark"
        activeModal={editModel}
        onClose={() => dispatch(toggleEditPaidLeaveModal(false))}
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
          <Textinput
            name="reason"
            label="Reason"
            type="text"
            placeholder="Enter Reason"
            defaultValue={paidleavesItem.reason}
            register={register}
            error={errors.reason?.message}
            className="h-[48px] bg-gray-50 border leading-none border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
          <div className="form-group">
            <label htmlFor="isPaid" className="form-label">
              Paid Leave:
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold">{isPaid ? "Paid" : "Unpaid"}</span>
              <ToggleButton
                value={isPaid}
                onToggle={() => setIsPaid(!isPaid)}
                colors={{
                  active: {
                    base: "rgb(72,160,250)",
                  },
                  inactive: {
                    base: "rgb(200,200,200)",
                  },
                }}
                renderThumb={({ style, ...props }) => (
                  <div
                    {...props}
                    style={{
                      ...style,
                      width: 60,
                      height: 30,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 15,
                      border: '1px solid rgb(72,160,250)',
                    }}
                  />
                )}
                renderTrack={({ style, ...props }) => (
                  <div
                    {...props}
                    style={{
                      ...style,
                      width: 120,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: isPaid ? 'rgb(72,160,250)' : 'rgb(200,200,200)',
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="ltr:text-right rtl:text-left">
            <button type="submit" className="btn btn-dark text-center">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditPaidLeave;
