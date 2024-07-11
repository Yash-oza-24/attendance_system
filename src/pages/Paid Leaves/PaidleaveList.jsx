import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import dayjs from "dayjs";
import { deletePaidleave, getPaidleave, setPaidLeaveItem } from "./Reducers/paidleavesSlice";


const PaidLeaveList = ({ paidLeaves }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.loggedInUser.role);
  const [selectedStatus, setSelectedStatus] = useState({
    value: "all",
    label: "All",
  });

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const COLUMNS = [
    {
        Header: "Date",
        accessor: "date",
        Cell: ({ cell }) => (
          <span>{dayjs(cell.value).format("YYYY-MM-DD")}</span>
        ),
      },
    {
        Header: "Reason",
        accessor: "reason",
        Cell: ({ cell }) => <span>{cell.value}</span>,
      },
    {
        Header: "Paid/UnPaid",
        accessor: "isPaid",
        Cell: ({ cell }) => <span>{cell.value}</span>,
      },
      
    
  ];
  if (userRole === "admin") {
    COLUMNS.push({
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          {/* Edit Button */}
          <Tooltip
            content="Edit"
            placement="top"
            arrow
            animation="shift-away"
            theme="success"
          >
            <button
              className="action-btn text-success-700 bg-success-200"
              type="button"
              onClick={() => actions[0].doit(row.original)}
            >
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>

          {/* Delete Button */}
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
              onClick={() => actions[1].doit(row.original)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    });
  }



  const filteredPaidLeaves = useMemo(() => {
    if (!selectedStatus || selectedStatus.value === "all") return paidLeaves;
    return paidLeaves.filter(
      (paidLeave) => paidLeave.isPaid === selectedStatus.value
    );
  }, [selectedStatus, paidLeaves]);
  const actions = [
    {
      // name: "edit",
      // icon: "heroicons:pencil-square",
      doit: (item) => dispatch(setPaidLeaveItem(item)),
    },

    {
      // name: "delete",
      // icon: "heroicons-outline:trash",
      doit: (item) => {
        dispatch(deletePaidleave(item._id));

        setTimeout(() => {
          dispatch(getPaidleave("user"));
        }, 500);
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredPaidLeaves, [filteredPaidLeaves]);

  // React Table Hooks
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
          <h4 className="card-title">Paid Leave List</h4>
          <div className="flex gap-4 items-center">
            <Select
              className="react-select"
              classNamePrefix="select"
              value={selectedStatus}
              onChange={handleStatusChange}
              options={statusOptions}
            />
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
             
            </button>
            <button
              className="button md:w-auto w-full"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
             
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
              
            </button>
            <button
              className="button md:w-auto w-full"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
             
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

export default PaidLeaveList;
