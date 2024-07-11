import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllEmployee,
  toggleEditModal,
  updateEmployee,
  updateUser,
} from "./Reducer/EmployeesSlice";
import Checkbox from "@/components/ui/Checkbox";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import * as yup from "yup";
import Icons from "../../components/ui/Icon";

const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "branchAdmin", label: "BranchAdmin" },
    { value: "employee", label: "Employee" },
  ];
  
  const branchOptions = [
    { value: "branch1", label: "B1" },
    { value: "branch2", label: "B2" },
    { value: "branch3", label: "B3" },
  ];
  
  const accessRightOptions = [
    { value: "dashboard", label: "Dashboard" },
    { value: "alluser", label: "All Users" },
    { value: "allemployees", label: "All Employees" },
    { value: "allbranch", label: "All Branches" },
    { value: "leaverequest", label: "Leave Request" },
    { value: "allLeaverequest", label: "All Leave Request" },
    { value: "settings", label: "Settings" },
  ];
  const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };
  const passwordValidation = yup.string().min(6, "Password must be at least 6 characters");
const EditEmployee = () => {
  const { editModal, editItem } = useSelector((state) => state.employee);
  const [accessRights, setAccessRights] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const FormValidationSchema = yup
    .object({
      username: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      mobile: yup.string().required("Mobile number is required"),
      password: yup.string().test(
        "password-test",
        "Password must be at least 6 characters",
        (value) => !value || passwordValidation.isValidSync(value)
    ),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  
  useEffect(() => {
    reset({editItem, password: ""});
    if (editItem?.role) {
      setValue(
        "role",
        roleOptions.find((option) => option.value === editItem.role)
      );
    }
    if (editItem?.branch) {
      setValue(
        "branch",
        branchOptions.find((option) => option.value === editItem.branch)
      );
    }
    // Set initial access rights
    setAccessRights(editItem?.accessRights || []);
  }, [editItem]);

  const handleAccessRightChange = (accessRight) => {
    // Toggle the access right
    if (accessRights.includes(accessRight)) {
      setAccessRights(accessRights.filter((item) => item !== accessRight));
    } else {
      setAccessRights([...accessRights, accessRight]);
    }
  };
  const onSubmit = (data) => {
    const { role, branch,password, ...userData } = data;

    const user = {
      id: editItem?._id,
      data: {
        ...userData,
        role: role.value, // Send only the value of the selected role
        branch: branch.value, // Send only the value of the selected branch
        accessRights: accessRights, // Include access rights
      },
    };
    if(password){
      user.data.password = password;
    }

    dispatch(updateUser(user));

    setTimeout(() => {
      dispatch(toggleEditModal(false));
      dispatch(getAllEmployee("employees"));
      reset();
    }, 500);
  };
  return (
    <div>
      <Modal  
        title="Edit Employee"
        labelclassName="btn-outline-dark"
        activeModal={editModal}
        onClose={() => dispatch(toggleEditModal(false))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
            <Textinput
              name="username"
              label="name"
              type="text"
              placeholder="Enter name"
              register={register}
              defaultValue={editItem.username}
              error={errors.name}
              className="h-[48px]"
            />
            <Textinput
              name="email"
              label="email"
              type="email"
              placeholder="Enter email"
              register={register}
              defaultValue={editItem.email}
              error={errors.email}
              className="h-[48px]"
            />
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
            <div>
              <label htmlFor="role" className="form-label">
                Select Role
              </label>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    id="role"
                    className="react-select"
                    classNamePrefix="select"
                    options={roleOptions}
                    {...field}
                    styles={styles}
                  />
                )}
              />
              {errors.role && (
                <span className="text-red-500">{errors.role.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="branch" className="form-label">
                Select Branch
              </label>
              <Controller
                name="branch"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    id="branch"
                    className="react-select"
                    classNamePrefix="select"
                    options={branchOptions}
                    {...field}
                    styles={styles}
                  />
                )}
              />
              {errors.branch && (
                <span className="text-red-500">{errors.branch.message}</span>
              )}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
            <Textinput
              name="mobile"
              label="mobile"
              type="tel"
              placeholder="Enter mobile no"
              register={register}
              defaultValue={editItem.mobile}
              error={errors.mobile}
              className="h-[48px]"
            />

            <div className="relative">
              <Textinput
                name="password"
                label="Password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                register={register}
                defaultValue={editItem.password}
                error={errors.password}
                className="h-[48px] pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-9"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <Icons icon="heroicons:eye" className="h-5 w-5 mt-2 text-gray-500" />
                ) : (
                  <Icons icon="mdi:eye-off" className="h-5 w-5 mt-2 text-gray-500" />
                )}
              </button>
            </div>
            <Textinput
              name="salary"
              label="salary"
              type="text"
              placeholder="Enter Salary"
              register={register}
              defaultValue={editItem.salary}
              error={errors.salary}
              className="h-[48px]"
            />
            <Textinput
              name="parentno"
              label="parentno"
              type="text"
              placeholder="Enter Parent No."
              register={register}
              defaultValue={editItem.parentno}
              error={errors.parentno}
              className="h-[48px]"
            />
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
            <div className="text-lg font-bold mb-2">Access Right</div>
            {accessRightOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                value={accessRights.includes(option.value)}
                onChange={() => handleAccessRightChange(option.value)}
              />
            ))}
          </div>

          <button className="btn btn-dark block w-full text-center">
            Update Employee
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EditEmployee;
