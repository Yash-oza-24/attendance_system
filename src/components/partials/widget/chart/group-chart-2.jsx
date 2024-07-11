import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Chart from "react-apexcharts";
import shade1 from "@/assets/images/all-img/shade-1.png";
import shade2 from "@/assets/images/all-img/shade-2.png";
import shade3 from "@/assets/images/all-img/shade-3.png";

const GroupChart2 = ({ allbranches, allemployee, alluser }) => {
  const statistics = [
    {
      //name: shapeLine1,
      title: "Totel Users",
      count: `${alluser.length}`,
      bg: "bg-[#E5F9FF] dark:bg-[#E5F9FF]	",
      text: "text-info-500",
      icon: "heroicons:user-group",
    },
    {
      //name: shapeLine2,
      title: "Total Branches",
      count: `${allbranches.length}`,
      bg: "bg-[#FFEDE5] dark:bg-[#FFEDE5]	",
      icon: "carbon:branch",
      text: "text-warning-500",
      
    },
    {
      // name: shapeLine3,
      title: "Total Employees",
      count: `${allemployee.length}`,
      bg: "bg-[#EAE5FF] dark:bg-[#EAE5FF]	",
      icon: "heroicons:users",
      text: "text-[#5743BE]",
   
    },
  ];
  return (
    <>
      {" "}
      {statistics.map((item, i) => (
        <div key={i}>
          <Card bodyClass="pt-4 pb-3 px-4" className={`border dark:border-slate-700`} >
            <div className={`flex space-x-3 rtl:space-x-reverse`}>
              <div className="flex-none">
         
                <div
                  className={`${item.bg} ${item.text} h-12 w-12 rounded-full flex flex-col items-center justify-center text-2xl`}
                >
                      <Icon icon={item.icon} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
                  {item.title}
                </div>
                <div className="text-slate-900 dark:text-white text-lg font-medium">
                  {item.count}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </>
  );
};

export default GroupChart2;
