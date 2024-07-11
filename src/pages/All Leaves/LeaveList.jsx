import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
  deleteLeave,
  updateLeave,
  toggleEditLeaveModal,
  getemployeeLeave,
} from "./Reducers/LeaveSilce";
import dayjs from "dayjs";
import GlobalFilter from "./GlobalFilter";

const LeaveList = ({ leaves }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.user);
  const userRole = loggedInUser ? loggedInUser.role : null;

  const COLUMNS = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "employeeName",
        Cell: ({ cell }) => (
          <div className="flex space-x-3 items-center text-left rtl:space-x-reverse">
            <div className="flex-1 font-medium text-sm leading-4 whitespace-nowrap">
              {cell.value}
            </div>
          </div>
        ),
      },
      {
        Header: "Mobile No.",
        accessor: "employeeMobileno",
        Cell: ({ cell }) => <span>{cell.value}</span>,
      },
      {
        Header: "StartDate",
        accessor: "startDate",
        Cell: ({ cell }) => (
          <span>{dayjs(cell.value).format("YYYY-MM-DD")}</span>
        ),
      },
      {
        Header: "EndDate",
        accessor: "endDate",
        Cell: ({ cell }) => (
          <span>{dayjs(cell.value).format("YYYY-MM-DD")}</span>
        ),
      },
      {
        Header: "Leave Days",
        accessor: "leaveDays",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "Reason",
        accessor: "reason",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-3 rtl:space-x-reverse">
            {(userRole === "branchAdmin" || userRole === "admin") && (
              <>
                <Tooltip
                  content="Approve"
                  placement="top"
                  arrow
                  theme="success"
                  animation="shift-away"
                >
                  <button
                    className="action-btn text-success-700 bg-success-200"
                    type="button"
                    onClick={() => actions[0].doit(row.original)}
                  >
                    <Icon icon="heroicons:shield-check" />
                  </button>
                </Tooltip>
                <Tooltip
                  content="Reject"
                  placement="top"
                  arrow
                  animation="shift-away"
                  theme="danger"
                >
                  <button
                    className="action-btn text-danger-500 bg-danger-200"
                    type="button"
                    onClick={() => actions[1].doit(row.original)}
                  >
                    <Icon icon="heroicons:x-mark" />
                  </button>
                </Tooltip>
              </>
            )}
            {(userRole === "branchAdmin" || userRole === "employee") && (
              <>
                <Tooltip
                  content="Edit"
                  placement="top"
                  arrow
                  theme="success"
                  animation="shift-away"
                >
                  <button
                    className="action-btn text-success-700 bg-success-200"
                    type="button"
                    onClick={() => actions[2].doit(row.original)}
                  >
                    <Icon icon="heroicons:pencil-square" />
                  </button>
                </Tooltip>
                <Tooltip
                  content="Delete"
                  placement="top"
                  arrow
                  animation="shift-away"
                  theme="danger"
                >
                  <button
                    className="action-btn text-danger-500 bg-danger-200"
                    type="button"
                    onClick={() => actions[3].doit(row.original)}
                  >
                    <Icon icon="heroicons:trash" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        ),
      },
    ],
    [userRole, navigate, dispatch]
  );

  const actions = [
    {
      doit: (item) => {
        dispatch(approveLeave(item._id)),
          setTimeout(() => {
            dispatch(getAllLeaves());
          }, 500);
      },
    },
    {
      doit: (item) => {
        dispatch(rejectLeave(item._id));

        setTimeout(() => {
          dispatch(getAllLeaves());
        }, 500);
      },
    },
    {
      doit: (item) => {
        dispatch(toggleEditLeaveModal(item));
      },
    },
    {
      doit: (item) => {
        dispatch(deleteLeave(item._id));
        setTimeout(() => {
          if (loggedInUser.role === "employee") {
            dispatch(getemployeeLeave(loggedInUser.username));
          } else {
            dispatch(getAllLeaves());
          }
        }, 500);
      },
    },
  ];

  // Ensure leaves is an array
  const data = useMemo(() => (Array.isArray(leaves) ? leaves : []), [leaves]);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <div className="flex justify-between items-center">
            <h4 className="card-title">Leave List</h4>
          </div>
          <div className="flex gap-2">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className=" bg-slate-100 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className=" even:bg-slate-100 dark:even:bg-slate-700"
                      >
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="table-td">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex items-center justify-between mt-8">
          <div className="flex items-center">
            <button
              className="button md:w-auto w-full"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {""}
            </button>
            <button
              className="button md:w-auto w-full"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {""}
            </button>
            <span className="text-sm font-medium">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <button
              className="button md:w-auto w-full"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {""}
            </button>
            <button
              className="button md:w-auto w-full"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {""}
            </button>
            <select
              className="form-select dark:bg-slate-800 ml-3"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    </>
  );
};

LeaveList.defaultProps = {
  leaves: [],
};

export default LeaveList;


// import React, { useMemo, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Card from "@/components/ui/Card";
// import Icon from "@/components/ui/Icon";
// import Tooltip from "@/components/ui/Tooltip";
// import { useNavigate } from "react-router-dom";
// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import {
//   getAllLeaves,
//   approveLeave,
//   rejectLeave,
//   deleteLeave,
//   updateLeave,
//   toggleEditLeaveModal,
//   getemployeeLeave,
// } from "./Reducers/LeaveSilce";
// import dayjs from "dayjs";
// import GlobalFilter from "./GlobalFilter";

// const LeaveList = ({ leaves }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loggedInUser } = useSelector((state) => state.user);
//   const userRole = loggedInUser ? loggedInUser.role : null;
//   //const role = user ? user.role : null; // Ensure role is not nul
//   const COLUMNS = useMemo(() => [
//       {
//         Header: "Name",
//         accessor: "employeeName",
//         Cell: ({ cell }) => (
//           <div className="flex space-x-3 items-center text-left rtl:space-x-reverse">
//             <div className="flex-1 font-medium text-sm leading-4 whitespace-nowrap">
//               {cell.value}
//             </div>
//           </div>
//         ),
//       },
//       {
//         Header: "Mobile No.",
//         accessor: "employeeMobileno",
//         Cell: ({ cell }) => <span>{cell.value}</span>,
//       },
//       {
//         Header: "StartDate",
//         accessor: "startDate",
//         Cell: ({ cell }) => (
//           <span>{dayjs(cell.value).format("YYYY-MM-DD")}</span>
//         ),
//       },
//       {
//         Header: "EndDate",
//         accessor: "endDate",
//         Cell: ({ cell }) => (
//           <span>{dayjs(cell.value).format("YYYY-MM-DD")}</span>
//         ),
//       },
//       {
//         Header: "Leave Days",
//         accessor: "leaveDays",
//         Cell: ({ cell }) => <div>{cell.value}</div>,
//       },
//       {
//         Header: "Reason",
//         accessor: "reason",
//         Cell: ({ cell }) => <div>{cell.value}</div>,
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ cell }) => <div>{cell.value}</div>,
//       },
//       {
//         Header: "Action",
//         accessor: "action",
//         Cell: ({ row }) => (
//           <div className="flex space-x-3 rtl:space-x-reverse">
//             {(userRole === "branchAdmin" || userRole === "admin") && (
//               <>
//                 <Tooltip
//                   content="Approve"
//                   placement="top"
//                   arrow
//                   theme="success"
//                   animation="shift-away"
//                 >
//                   <button
//                     className="action-btn text-success-700 bg-success-200"
//                     type="button"
//                     onClick={() => actions[0].doit(row.original)}
//                   >
//                     <Icon icon="heroicons:shield-check" />
//                   </button>
//                 </Tooltip>
//                 <Tooltip
//                   content="Reject"
//                   placement="top"
//                   arrow
//                   animation="shift-away"
//                   theme="danger"
//                 >
//                   <button
//                     className="action-btn text-danger-500 bg-danger-200"
//                     type="button"
//                     onClick={() => actions[1].doit(row.original)}
//                   >
//                     <Icon icon="heroicons:x-mark" />
//                   </button>
//                 </Tooltip>
//               </>
//             )}
//             {(userRole === "branchAdmin" || userRole === "employee") && (
//               <>
//                 <Tooltip
//                   content="Edit"
//                   placement="top"
//                   arrow
//                   theme="success"
//                   animation="shift-away"
//                 >
//                   <button
//                     className="action-btn text-success-700 bg-success-200"
//                     type="button"
//                     onClick={() => actions[2].doit(row.original)}
//                   >
//                     <Icon icon="heroicons:pencil-square" />
//                   </button>
//                 </Tooltip>
//                 <Tooltip
//                   content="Delete"
//                   placement="top"
//                   arrow
//                   animation="shift-away"
//                   theme="danger"
//                 >
//                   <button
//                     className="action-btn text-danger-500 bg-danger-200"
//                     type="button"
//                     onClick={() => actions[3].doit(row.original)}
//                   >
//                     <Icon icon="heroicons:trash" />
//                   </button>
//                 </Tooltip>
//               </>
//             )}
//           </div>
//         ),
//       },
//     ],
//     [userRole, navigate, dispatch]
//   );

//   const actions = [
//     {
//       doit: (item) => {
//         dispatch(approveLeave(item._id)),
//           setTimeout(() => {
//             dispatch(getAllLeaves());
//           }, 500);
//       },
//     },
//     {
//       doit: (item) => {
//         dispatch(rejectLeave(item._id));

//         setTimeout(() => {
//           dispatch(getAllLeaves());
//         }, 500);
//       },
//     },
//     {
//       doit: (item) => {
//         dispatch(toggleEditLeaveModal(item));
//       },
//     },
//     {
//       doit: (item) => {
//         dispatch(deleteLeave(item._id));
//         setTimeout(() => {
//           if (loggedInUser.role === "employee") {
//             dispatch(getemployeeLeave(loggedInUser.username));
//           } else {
//             dispatch(getAllLeaves());
//           }
//         }, 500);
//       },
//     },
//   ];

//   const columns = useMemo(() => COLUMNS, []);
//   const data = useMemo(() => leaves, [leaves]);

//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useRowSelect
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     footerGroups,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     state,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//     prepareRow,
//   } = tableInstance;

//   const { globalFilter, pageIndex, pageSize } = state;

//   return (
//     <>
//       <Card noborder>
//         <div className="md:flex justify-between items-center mb-6">
//           <div className="flex justify-between items-center">
//             <h4 className="card-title">Leave List</h4>
//           </div>
//           <div className="flex gap-2">
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//           </div>
//         </div>
//         <div className="overflow-x-auto -mx-6">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden ">
//               <table
//                 className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
//                 {...getTableProps()}
//               >
//                 <thead className=" bg-slate-100 dark:bg-slate-700">
//                   {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                       {headerGroup.headers.map((column) => (
//                         <th
//                           {...column.getHeaderProps(
//                             column.getSortByToggleProps()
//                           )}
//                           scope="col"
//                           className=" table-th "
//                         >
//                           {column.render("Header")}
//                           <span>
//                             {column.isSorted
//                               ? column.isSortedDesc
//                                 ? " 🔽"
//                                 : " 🔼"
//                               : ""}
//                           </span>
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <tbody
//                   className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
//                   {...getTableBodyProps()}
//                 >
//                   {page.map((row) => {
//                     prepareRow(row);
//                     return (
//                       <tr
//                         {...row.getRowProps()}
//                         className=" even:bg-slate-100 dark:even:bg-slate-700"
//                       >
//                         {row.cells.map((cell) => (
//                           <td {...cell.getCellProps()} className="table-td">
//                             {cell.render("Cell")}
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <div className="md:flex items-center justify-between mt-8">
//           <div className="flex items-center">
//             <button
//               className="button md:w-auto w-full"
//               onClick={() => gotoPage(0)}
//               disabled={!canPreviousPage}
//             >
//               {""}
//             </button>
//             <button
//               className="button md:w-auto w-full"
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//             >
//               {""}
//             </button>
//             <span className="text-sm font-medium">
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>{" "}
//             </span>
//             <button
//               className="button md:w-auto w-full"
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//             >
//               {""}
//             </button>
//             <button
//               className="button md:w-auto w-full"
//               onClick={() => gotoPage(pageCount - 1)}
//               disabled={!canNextPage}
//             >
//               {""}
//             </button>
//             <select
//               className="form-select dark:bg-slate-800 ml-3"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   Show {pageSize}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default LeaveList;
