import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import TableLoading from "@/components/skeleton/Table";
import { getAllBranches } from "../All Branch/Reducers/BranchSlice";
import { ToastContainer } from "react-toastify";
import BranchList from "./BranchList"
import EditBranch from "./EditBranch";
import AddUser from "./AddBranch";
import { toggleAddModal } from "../UserPage/Reducer/UserSlice";
import AddBranch from "./AddBranch";

const AllBranchPage = () => {
    const [filler, setfiller] = useState("list");
    const { width, breakpoints } = useWidth();
    const [isLoaded, setIsLoaded] = useState(false);

    const { branches } = useSelector((state) => state.branches);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllBranches("branches"));
    }, [])

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
                    Branches
                </h4>
                <div
                    className={`${width < breakpoints.md ? "space-x-rb" : ""
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
                        text="Add Branch"
                        className="btn-dark dark:bg-slate-700  h-min text-sm font-normal"
                        iconClass=" text-lg"
                        onClick={() => dispatch(toggleAddModal(true))}
                    />
                </div>
            </div>
            {/* {isLoaded && filler === "grid" && (
                <GridLoading count={projects?.length} />
            )} */}
            {isLoaded && filler === "list" && (
                <TableLoading count={branches?.length} />
            )}

            {/* {filler === "grid" && !isLoaded && (
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                    {projects.map((project, projectIndex) => (
                        <EmployeesGrid project={project} key={projectIndex} />
                    ))}
                </div>
            )} */}
            {filler === "list" && !isLoaded && (
                <div>
                    <BranchList branches={branches} />
                </div>
            )}
            <AddBranch />
          <EditBranch/>
        </div>
    );
};

export default AllBranchPage;
