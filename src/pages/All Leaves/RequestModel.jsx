// import React, { useEffect, useState } from "react";
// import Modal from "@/components/ui/Modal";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   createLeave,
//   getemployeeLeave,
//   toggleLeaveModal,
// } from "./Reducers/LeaveSilce";
// import Textinput from "@/components/ui/Textinput";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import Select from "react-select";
// import * as yup from "yup";
// import DatePicker from "react-flatpickr";
// import { json } from "react-router-dom";
// import Flatpickr from "react-flatpickr";

// const leaveTypeOptions = [
//   { value: "Personal", label: "Personal" },
//   { value: "Other", label: "Other" },
//   { value: "Sick", label: "Sick" },
//   { value: "Vacation", label: "Vacation" },
// ];
// const shiftOptions = [
//   { value: "First Shift", label: "First Shift" },
//   { value: "Second Shift", label: "Second Shift" },
//   { value: "Full Day", label: "Full Day" },
// ];

// const styles = {
//   option: (provided, state) => ({
//     ...provided,
//     fontSize: "14px",
//   }),
// };

// const LeaveRequestModel = () => {
//   const { leaveModal, leaveItem } = useSelector((state) => state.leave);
//   const { loggedInUser } = useSelector((state) => state.user);

//   const { users } = useSelector((state) => state.user);
//    const [selectedUserMobile, setSelectedUserMobile] = useState("");
//   console.log(users);
//   const allUserOptions = users.map((user) => ({
//     value: user.username,
//     label: user.username,
//     mobileno : user.mobile
//   }));
//   console.log(allUserOptions)

//   const dispatch = useDispatch();

//   const FormValidationSchema = yup
//     .object({
//       startDate: yup.date().required("Start date is required"),
//       endDate: yup.date().required("End date is required"),
//       reason: yup.string().required("Reason is required"),
//       leaveType: yup.object().required("Leave type is required"),
//     })
//     .required();
//   const {
//     register,
//     control,
//     reset,
//     formState: { errors },
//     handleSubmit,
//     setValue,
//   } = useForm({
//     resolver: yupResolver(FormValidationSchema),
//     mode: "all",
//   });

//   useEffect(() => {
//     reset(leaveItem);
//     if (leaveItem?.leaveType) {
//       setValue(
//         "leaveType",
//         leaveTypeOptions.find((option) => option.value === leaveItem.leaveType)
//       );
//     }
//     if (leaveItem?.shift) {
//       setValue(
//         "shift",
//         shiftOptions.find((option) => option.value === leaveItem.shift)
//       );
//     }
//   }, [leaveItem]);

//   const onSubmit = (data) => {
//     const leaveData = {
//       ...data,
//       leaveType: data.leaveType.value,
//       shift: data.shift.value,
//       employeeName: data.selectedUser.value,
//       employeeMobileno: selectedUserMobile,
//     };

//     dispatch(createLeave(leaveData));

//     setTimeout(() => {
//       dispatch(toggleLeaveModal(false));
//       dispatch(getemployeeLeave(loggedInUser.name));
//       reset();
//     }, 500);
//   };

//   return (
//     <div>
//       <Modal
//         title="Leave Request"
//         labelclassName="btn-outline-dark"
//         activeModal={leaveModal}
//         onClose={() => dispatch(toggleLeaveModal(false))}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
//        {loggedInUser.role === "branchAdmin" && (
//         <div>
//             <label htmlFor="selectedUser" className="form-label">
//               Select User
//             </label>
//             <Controller
//               name="selectedUser"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <Select
//                   id="selectedUser"
//                   className="react-select"
//                   classNamePrefix="select"
//                   options={allUserOptions}
//                   onChange={(option) => {
//                       field.onChange(option);
//                       setSelectedUserMobile(option.mobileno); // Set the mobile number when a user is selected
//                     }}
//                   styles={styles}
//                 />
//               )}
//             />
//             {errors.selectedUser && (
//               <span className="text-red-500">{errors.selectedUser.message}</span>
//             )}
//           </div>
//        )}

//           <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
//             <div className="relative">
//               <label htmlFor="startDate" className="form-label">
//                 Start Date
//               </label>
//               <Controller
//                 name="startDate"
//                 control={control}
//                 render={({ field }) => (
//                   <DatePicker
//                     id="startDate"
//                     selected={field.value}
//                     onChange={(date) => field.onChange(date)}
//                     className="input-class"
//                     placeholderText="Enter start date"
//                   />
//                 )}
//               />
//               {errors.startDate && (
//                 <span className="text-red-500">{errors.startDate.message}</span>
//               )}
//             </div>
//             <div className="">
//               <label htmlFor="endDate" className="form-label">
//                 End Date
//               </label>
//               <Controller
//                 name="endDate"
//                 control={control}
//                 render={({ field }) => (
//                   <DatePicker
//                     id="endDate"
//                     selected={field.value}
//                     onChange={(date) => field.onChange(date)}
//                     className="input-class"
//                     placeholderText="Enter end date"
//                   />
//                 )}
//               />
//               {errors.endDate && (
//                 <span className="text-red-500">{errors.endDate.message}</span>
//               )}
//             </div>
//           </div>
//           <div>
//             <label htmlFor="leaveType" className="form-label">
//               Leave Type
//             </label>
//             <Controller
//               name="shift"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <Select
//                   id="shift"
//                   className="react-select"
//                   classNamePrefix="select"
//                   options={shiftOptions}
//                   {...field}
//                   styles={styles}
//                 />
//               )}
//             />
//             {errors.shift && (
//               <span className="text-red-500">{errors.shift.message}</span>
//             )}
//           </div>

//           <Textinput
//             name="reason"
//             label="Reason"
//             type="text"
//             placeholder="Enter reason"
//             register={register}
//             defaultValue={leaveItem?.reason}
//             error={errors.reason}
//             className="h-[48px]"
//           />
//           <div>
//             <label htmlFor="leaveType" className="form-label">
//               Leave Type
//             </label>
//             <Controller
//               name="leaveType"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <Select
//                   id="leaveType"
//                   className="react-select"
//                   classNamePrefix="select"
//                   options={leaveTypeOptions}
//                   {...field}
//                   styles={styles}
//                 />
//               )}
//             />
//             {errors.leaveType && (
//               <span className="text-red-500">{errors.leaveType.message}</span>
//             )}
//           </div>
//           <Textinput
//             name="comments"
//             label="Comments"
//             type="text"
//             placeholder="Enter comments (optional)"
//             register={register}
//             defaultValue={leaveItem?.comments}
//             error={errors.comments}
//             className="h-[48px]"
//           />
//           <button className="btn btn-dark block w-full text-center">
//             Submit Leave Request
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default LeaveRequestModel;
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  createLeave,
  getAllLeaves,
  getemployeeLeave,
  toggleLeaveModal,
} from "./Reducers/LeaveSilce";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import * as yup from "yup";
import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_green.css";

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
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const LeaveRequestModel = () => {
  const { leaveModal, leaveItem } = useSelector((state) => state.leave);
  const { loggedInUser } = useSelector((state) => state.user);

  const { users } = useSelector((state) => state.user);
  const [selectedUserMobile, setSelectedUserMobile] = useState("");
  const [selectedUserBranch, setSelectedUserBranch] = useState("");
  
  const allUserOptions = users.map((user) => ({
    value: user.username,
    label: user.username,
    mobileno: user.mobile,
    branch: user.branch,
  }));

  const dispatch = useDispatch();

  const FormValidationSchema = yup
    .object({
      dateRange: yup.array().of(yup.date()).required("Date range is required"),
      reason: yup.string().required("Reason is required"),
      leaveType: yup.object().required("Leave type is required"),
    })
    .required();
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  useEffect(() => {
    reset(leaveItem);
    if (leaveItem?.leaveType) {
      setValue(
        "leaveType",
        leaveTypeOptions.find((option) => option.value === leaveItem.leaveType)
      );
    }
    if (leaveItem?.shift) {
      setValue(
        "shift",
        shiftOptions.find((option) => option.value === leaveItem.shift)
      );
    }
  }, [leaveItem]);

  const onSubmit = (data) => {
    // Extracting startDate and endDate from dateRange array
    const [startDate, endDate] = data.dateRange;

    // Creating the leaveData object
    const leaveData = {
      comment: data.comment,
      reason: data.reason,
      leaveType: data.leaveType.value,
      shift: data.shift.value,
      startDate, // Adding startDate
      endDate,
      branch: selectedUserBranch !== "" ? selectedUserBranch : loggedInUser?.branch
    };
    if (loggedInUser.role === "employee") {
      leaveData.employeeName = loggedInUser.username;
      leaveData.employeeMobileno = loggedInUser.mobile;
    } else if (loggedInUser.role === "branchAdmin") {
      leaveData.employeeName = data.selectedUser.value;
      leaveData.employeeMobileno = selectedUserMobile;
    }
    console.log("Submitting leave data:", leaveData); //
    // Dispatching action to create leave
    dispatch(createLeave(leaveData));

    // Resetting the form after submission
    setTimeout(() => {
      dispatch(toggleLeaveModal(false));
      {
        loggedInUser.role === "employee" &&
          dispatch(getemployeeLeave(loggedInUser.username));
      }
      dispatch(getAllLeaves())
      reset();
    }, 500);
  };

  return (
    <div>
      <Modal
        title="Leave Request"
        labelclassName="btn-outline-dark"
        activeModal={leaveModal}
        onClose={() => dispatch(toggleLeaveModal(false))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
          {loggedInUser?.role === "branchAdmin" && (
            <div>
              <label htmlFor="selectedUser" className="form-label">
                Select User
              </label>
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
                      setSelectedUserBranch(option.branch); // Set the mobile number when a user is selected
                    }}
                    styles={styles}
                  />
                )}
              />
              {errors.selectedUser && (
                <span className="text-red-500">
                  {errors.selectedUser.message}
                </span>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
            <div className="relative">
              <label htmlFor="dateRange" className="form-label">
                Date Range
              </label>
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
                    placeholder="YYYY-MM-DD-YYYY-MM-DD"
                  />
                )}
              />
              {errors.dateRange && (
                <span className="text-red-500">{errors.dateRange.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="shift" className="form-label">
                Shift
              </label>
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
            defaultValue={leaveItem?.reason}
            error={errors.reason}
            className="h-[48px]"
          />
          <div>
            <label htmlFor="leaveType" className="form-label">
              Leave Type
            </label>
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
            defaultValue={leaveItem?.comments}
            error={errors.comments}
            className="h-[48px]"
          />
          <button className="btn btn-dark block w-full text-center">
            Submit Leave Request
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveRequestModel;
