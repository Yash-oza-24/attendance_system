import React, { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";

import { updateData, getData, toggleEditModal } from "./Reducers/settingSlice";

const EditSettings = () => {
    const { editModal, editItem } = useSelector((state) => state.setting);
    const dispatch = useDispatch();

    const FormValidationSchema = yup.object({
        totalWorkingHours: yup.number().required("Working Hours are required"),
        totalDaysInMonth: yup.number().required("Total Days in Month are required"),
        start: yup.string().required("Start Time is required"),
        end: yup.string().required("End Time is required"),
    }).required();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    });

    useEffect(() => {
        if (editItem) {
            const start = editItem?.standardWorkingHours?.start
                ? dayjs(editItem.standardWorkingHours.start).format("hh:mm")
                : "";
            const end = editItem?.standardWorkingHours?.end
                ? dayjs(editItem.standardWorkingHours.end).format("hh:mm")
                : "";

            reset({
                ...editItem,
                start,
                end,
            });
        }
    }, [editItem, reset]);

    const onSubmit = (data) => {
        const currentDate = dayjs().format("YYYY-MM-DD");

        const startTime = dayjs(`${currentDate}T${data.start}`).toISOString();
        const endTime = dayjs(`${currentDate}T${data.end}`).toISOString();

        const editSet = {
            totalWorkingHours: data.totalWorkingHours,
            totalDaysInMonth: data.totalDaysInMonth,
            standardWorkingHours: {
                start: startTime,
                end: endTime,
            },
        };

        dispatch(updateData({ id: editItem._id, data: editSet }));
        setTimeout(() => {
            dispatch(toggleEditModal(false));
            dispatch(getData("setting"));
            reset();
        }, 500);
    };

    return (
        <div>
            <Modal
                title="Update Working Hours and Days"
                labelclassName="btn-outline-dark"
                activeModal={editModal}
                onClose={() => dispatch(toggleEditModal(false))}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 grid-cols-1">
                        <Textinput
                            name="totalWorkingHours"
                            label="Total Working Hours"
                            type="number"
                            placeholder="Total Working Hours"
                            defaultValue={editItem?.totalWorkingHours}
                            register={register}
                            error={errors.totalWorkingHours?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="totalDaysInMonth"
                            label="Total Days in Month"
                            type="number"
                            placeholder="Total Days in Month"
                            defaultValue={editItem?.totalDaysInMonth}
                            register={register}
                            error={errors.totalDaysInMonth?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="start"
                            label="Standard Working Hours Start"
                            type="time"
                            placeholder="Start Time"
                            defaultValue={editItem?.standardWorkingHours?.start
                                ? dayjs(editItem.standardWorkingHours.start).format("HH:mm A")
                                : ""}
                            register={register}
                            error={errors.start?.message}
                            className="h-[48px]"
                        />
                        <Textinput
                            name="end"
                            label="Standard Working Hours End"
                            type="time"
                            placeholder="End Time"
                            defaultValue={editItem?.standardWorkingHours?.end
                                ? dayjs(editItem.standardWorkingHours.end).format("HH:mm A")
                                : ""}
                            register={register}
                            error={errors.end?.message}
                            className="h-[48px]"
                        />
                    </div>

                    <button type="submit" className="btn btn-dark block w-full text-center">
                        Update
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default EditSettings;
