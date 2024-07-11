import React from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs"; // Import dayjs
import { adddata, getData, toggleAddModal } from "./Reducers/settingSlice";

const AddWorkingHoursAndDays = () => {
    const { addModel } = useSelector((state) => state.setting);
    const dispatch = useDispatch();

    const FormValidationSchema = yup.object({
        totalWorkingHours: yup.number().required("Working Hours are required"),
        totalDaysInMonth: yup.number().required("Total Days in Month are required"),
        start: yup.string().required("Start Time is required"),
        end: yup.string().required("End Time is required"),
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
        const currentDate = dayjs().format("YYYY-MM-DD");

        const startTime = dayjs(`${currentDate}T${data.start}`).toISOString();
        const endTime = dayjs(`${currentDate}T${data.end}`).toISOString();

        const newSetting = {
            totalWorkingHours: data.totalWorkingHours,
            totalDaysInMonth: data.totalDaysInMonth,
            standardWorkingHours: {
                start: startTime,
                end: endTime
            }
        };

        dispatch(adddata(newSetting));
        setTimeout(() => {
            dispatch(toggleAddModal(false));
            dispatch(getData("setting"));
            reset();
        }, 500);
    };

    return (
        <div>
            <Modal
                title="Add Working Hours and Days"
                labelclassName="btn-outline-dark"
                activeModal={addModel}
                onClose={() => dispatch(toggleAddModal(false))}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
                        <Textinput
                            name="totalWorkingHours"
                            label="Total Working Hours"
                            type="number"
                            placeholder="Total Working Hours"
                            register={register}
                            error={errors.totalWorkingHours?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="totalDaysInMonth"
                            label="Total Days in Month"
                            type="number"
                            placeholder="Total Days in Month"
                            register={register}
                            error={errors.totalDaysInMonth?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="start"
                            label="Standard Working Hours Start"
                            type="time"
                            placeholder="Start Time"
                            register={register}
                            error={errors.start?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="end"
                            label="Standard Working Hours End"
                            type="time"
                            placeholder="End Time"
                            register={register}
                            error={errors.end?.message}
                            className="h-[48px]"
                        />
                    </div>

                    <button type="submit" className="btn btn-dark block w-full text-center">
                        Add
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AddWorkingHoursAndDays;