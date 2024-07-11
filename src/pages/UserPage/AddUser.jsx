import React from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { addNewUser, getAllUsers, toggleAddModal } from "./Reducer/UserSlice";


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

const styles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const AddUser = () => {
    const { addModel } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const FormValidationSchema = yup.object({
        username: yup.string().required("Name is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        mobile: yup.string().required("Mobile number is required"),
        password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
        role: yup.object().shape({
            value: yup.string().required("Role is required"),
            label: yup.string(),
        }).required("Role is required"),
        branch: yup.object().shape({
            value: yup.string().required("Branch is required"),
            label: yup.string(),
        }).required("Branch is required"),
        salary: yup.string().required("Salary is required"),
        parentno : yup.string().required("Parent No is required"),
        address: yup.string().required("Address is required")
    }).required();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    });

    const onSubmit = (data) => {
        const user = {
            username: data.username,
            email: data.email,
            mobile: data.mobile,
            password: data.password,
            role: data.role.value,
            branch: data.branch.value,
            salary: data.salary,
            parentno : data.parentno,
            address : data.address
        };

        dispatch(addNewUser(user));
        setTimeout(() => {
            dispatch(toggleAddModal(false));
            dispatch(getAllUsers("user"));
            reset();
        }, 500);
    };

    return (
        <div>
            <Modal
                title="Add New User"
                labelclassName="btn-outline-dark"
                activeModal={addModel}
                onClose={() => dispatch(toggleAddModal(false))}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
                        <Textinput
                            name="username"
                            label="name"
                            type="text"
                            placeholder="Enter name"
                            register={register}
                            error={errors.username?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="email"
                            label="email"
                            type="email"
                            placeholder="Enter email"
                            register={register}
                            error={errors.email?.message}
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
                            {errors.role && <span className="text-red-500">{errors.role.message}</span>}
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
                            {errors.branch && <span className="text-red-500">{errors.branch.message}</span>}
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
                        <Textinput
                            name="mobile"
                            label="mobile"
                            type="tel"
                            placeholder="Enter mobile no"
                            register={register}
                            error={errors.mobile?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="password"
                            label="password"
                            type="password"
                            placeholder="Enter password"
                            register={register}
                            error={errors.password?.message}
                            className="h-[48px]"
                        />
                    </div>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
                        <Textinput
                            name="salary"
                            label="Salary"
                            type="text"
                            placeholder="Enter Salary"
                            register={register}
                            error={errors.salary?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="parentno"
                            label="Parent No."
                            type="text"
                            placeholder="Enter Parent No."
                            register={register}
                            error={errors.parentno?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="address"
                            label="Address"
                            type="text"
                            placeholder="Enter Address"
                            register={register}
                            error={errors.address?.message}
                            className="h-[48px]"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-dark block w-full text-center">
                        Create an account
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AddUser;
