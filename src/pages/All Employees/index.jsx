import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { getAllEmployee } from "./Reducer/EmployeesSlice";
import { ToastContainer } from "react-toastify";
import EmployeesGrid from "./EmployeesGrid";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import EmployeesList from "./EmployeesList";
import { toggleAddModal } from "../UserPage/Reducer/UserSlice";
const AllEmployeesPage = () => {
    const [filler, setfiller] = useState("list");
    const { width, breakpoints } = useWidth();
    const [isLoaded, setIsLoaded] = useState(false);
    const { employee } = useSelector((state) => state.employee);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllEmployee("employee"));
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
                    Employees
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
                        text="Add Employee"
                        className="btn-dark dark:bg-slate-700  h-min text-sm font-normal"
                        iconClass=" text-lg"
                        onClick={() => dispatch(toggleAddModal(true))}
                    />
                </div>
            </div>
            {isLoaded && filler === "grid" && (
                <GridLoading count={employee?.length} />
            )}
            {isLoaded && filler === "list" && (
                <TableLoading count={employee?.length} />
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
                    <EmployeesList employee={employee} />
                </div>
            )}
            <AddEmployee />
            <EditEmployee />
        </div>
    );
};

export default AllEmployeesPage;
