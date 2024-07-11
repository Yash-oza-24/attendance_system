import React from "react";
import Icon from "@/components/ui/Icon";
const data = [
  {
    title: "Total ",
    count: "64",
    bg: "bg-info-500",
    text: "text-info-500",
    percent: "25.67% ",
    icon: "heroicons-outline:menu-alt-1",
  },
  {
    title: "Completed ",
    count: "45",
    bg: "bg-warning-500",
    text: "text-warning-500",
    percent: "8.67%",
    icon: "heroicons-outline:chart-pie",
  },
  {
    title: "Hours",
    count: "190",
    bg: "bg-primary-500",
    text: "text-primary-500",
    percent: "1.67%  ",
    icon: "heroicons-outline:clock",
  },
  {
    title: "Spendings",
    count: "$3,564",
    bg: "bg-success-500",
    text: "text-success-500",
    percent: "11.67%  ",
    icon: "heroicons-outline:calculator",
  },
];

const GroupChart4 = ({ data }) => {
  console.log(data);
  let details = data.currentMonthAttendance[0];
  console.log(details);
  return (
    <>
      <div
        className={`bg-info-500 rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
      >
        {" "}
        Daily Working Hours
        <div
          className={`text-warning-500 mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4 `}
        ></div>
        <span className="block text-sm text-black font-medium dark:text-white mb-1">
          {details.dailyWorkingHours}
        </span>
        <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium"></span>
      </div>
      <div
        className={`bg-warning-500 rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
      >
        {" "}
        Daily Working Hours
        <div
          className={`text-warning-500 mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4 `}
        ></div>
        <span className="block text-sm text-black font-medium dark:text-white mb-1">
          {details.dailyWorkingHours}
        </span>
        <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium"></span>
      </div>
      <div
        className={`bg-primary-500 rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
      >
        {" "}
        Daily Working Hours
        <div
          className={`text-warning-500 mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4 `}
        ></div>
        <span className="block text-sm text-black font-medium dark:text-white mb-1">
          {details.dailyWorkingHours}
        </span>
        <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium"></span>
      </div>
      <div
        className={`bg-success-500 rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
      >
        {" "}
        Daily Working Hours
        <div
          className={`text-warning-500 mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4 `}
        ></div>
        <span className="block text-sm text-black font-medium dark:text-white mb-1">
          {details.dailySalary}
        </span>
        <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium"></span>
      </div>
    </>
  );
};

export default GroupChart4;
