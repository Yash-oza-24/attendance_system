import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import Button from "@/components/ui/Button";
// import LeaveList from "./LeaveList";
import useWidth from "@/hooks/useWidth";
import SettingGrid from "./workingSettings";
import { toggleAddModal, getData } from "./Reducers/settingSlice";
import AddWorkingHoursAndDays from "./AddSettings";
import { useSelector } from "react-redux";
import EditSettings from "./EditSettings";

const SettingsPage = () => {
  const { width, breakpoints } = useWidth();
  const [filler, setFiller] = useState("grid");
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useSelector((state) => state.setting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);
  return (
    <>
      <div>
        <ToastContainer />
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
            Settings
          </h4>
          <div
            className={`${
              width < breakpoints.md ? "space-x-rb" : ""
            } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
          >
            {settings.length === 0 && (
              <Button
                icon="heroicons-outline:plus"
                text="Add Settings"
                className="btn-dark dark:bg-slate-700  h-min text-sm font-normal"
                iconClass=" text-lg"
                onClick={() => dispatch(toggleAddModal(true))}
              />
            )}
          </div>
        </div>

        {filler === "grid" && !isLoaded && (
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <SettingGrid set={settings} />
            </div>
          </div>
        )}
      </div>
      <EditSettings/>
      <AddWorkingHoursAndDays />
    </>
  );
};

export default SettingsPage;
