import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { toggleLeaveModal } from "../All Leaves/Reducers/LeaveSilce";
import { ToastContainer } from "react-toastify";
import { getAllUsers, toggleAddModal } from "./Reducer/UserSlice";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import UserList from "./UserList";
import LeaveRequestModel from "../All Leaves/RequestModel";

const AllUserPage = () => {
  const [filler, setfiller] = useState("list");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);

  const { loggedInUser, users } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1500);
  }, [filler]);

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Users
        </h4>
        <div
          className={`${
            width < breakpoints.md ? "space-x-rb" : ""
          } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
        >
          {/* <Button
                        icon="heroicons:list-bullet"
                        text="List view"
                        disabled={isLoaded}
                        className={`${filler === "list"
                            ? "bg-slate-900 dark:bg-slate-700  text-white"
                            : " bg-white dark:bg-slate-800 dark:text-slate-300"
                            }   h-min text-sm font-normal`}
                        iconClass=" text-lg"
                        onClick={() => setfiller("list")}
                    /> */}
          {/* <Button
                        icon="heroicons-outline:view-grid"
                        text="Grid view"
                        disabled={isLoaded}
                        className={`${filler === "grid"
                            ? "bg-slate-900 dark:bg-slate-700 text-white"
                            : " bg-white dark:bg-slate-800 dark:text-slate-300"
                            }   h-min text-sm font-normal`}
                        iconClass=" text-lg"
                        onClick={() => setfiller("grid")}
                    /> */}

          <Button
            icon="heroicons-outline:plus"
            text="Add User"
            className="btn-dark dark:bg-slate-700  h-min text-sm font-normal"
            iconClass=" text-lg"
            onClick={() => dispatch(toggleAddModal(true))}
          />
          {/* {loggedInUser.role === "branchAdmin" && (
            <Button
              icon="heroicons-outline:plus"
              text="Add Leave Request"
              className="btn-dark dark:bg-slate-800  h-min text-sm font-normal"
              iconClass=" text-lg"
              onClick={() => dispatch(toggleLeaveModal(true))}
            />
          )} */}
        </div>
      </div>
      {/* {isLoaded && filler === "grid" && (
                <GridLoading count={projects?.length} />
            )} */}
      {isLoaded && filler === "list" && <TableLoading count={users?.length} />}

      {/* {filler === "grid" && !isLoaded && (
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                    {projects.map((project, projectIndex) => (
                        <EmployeesGrid project={project} key={projectIndex} />
                    ))}
                </div>
            )} */}
      {filler === "list" && !isLoaded && (
        <div>
          <UserList users={users} />
        </div>
      )}
      <AddUser />
      <EditUser />
      <LeaveRequestModel />
    </div>
  );
};

export default AllUserPage;
