import React from "react";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

const GroupChart1 = ({ totalSalary, setting }) => {
  const { salary } = useSelector((state) => state.user.loggedInUser);
  const statistics = [
    {
      title: "Working Hours in Day",
      count: `${setting.totalWorkingHours}`,
      bg: "bg-danger-300",
      icon: "heroicons:clock",
    },
    {
      title: "Working Days In Month",
      count: `${setting.totalDaysInMonth}`,
      bg: "bg-success-300",
      icon: "heroicons:calendar-days",
    },
    {
      title: "Total Salary (Monthly)",
      count: `${salary}`,
      bg: "bg-info-300",
      icon: "heroicons:currency-rupee",
    },
    {
      title: "Total Monthly Salary",
      count: `${totalSalary}`,
      bg: "bg-primary-300",
      icon: "heroicons:banknotes",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
      {statistics.map((item, i) => (
        <Card key={i} bodyClass="pt-4 pb-3 px-4" className="border rounded dark:border-slate-700">
          <div className={`py-4 px-4 rounded-md ${item.bg}`}>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
                <div className={`${item.bg} dark:text-black-500 h-12 w-12 rounded-full flex items-center justify-center text-2xl`}>
                  <Icon icon={item.icon} />
                </div>
              </div>
              <div className="flex-1 dark:text-black-500">
                <div className="text-black-500 dark:text-black-800 text-sm mb-1 font-medium">
                  {item.title}
                </div>
                <div className="text-black-500 dark:text-black-800 text-lg font-medium">
                  {item.count}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupChart1;
