import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import { deleteUser, editUserData, getAllUsers } from "./Reducer/UserSlice";

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const UserList = ({ users }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.user);
  const [selectedRole, setSelectedRole] = useState({
    value: "all",
    label: "Select All",
  });
  const role = loggedInUser?.role;
  const COLUMNS = [
    {
      Header: "Name",
      accessor: "username",
      Cell: (row) => {
        return (
          <div className="flex space-x-3 items-center text-left rtl:space-x-reverse">
            <div className="flex-1 font-medium text-sm leading-4 whitespace-nowrap">
              {row?.cell?.value}
            </div>
          </div>
        );
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Position",
      accessor: "role",
      Cell: (row) => {
        return <div>{row?.cell?.value}</div>;
      },
    },
    {
      Header: "Mobile",
      accessor: "mobile",
      Cell: (row) => {
        return <div>{row?.cell?.value}</div>;
      },
    },
    {
      Header: "Branch",
      accessor: "branch",
      Cell: (row) => {
        return <div>{row?.cell?.value}</div>;
      },
    },
    {
      Header: "Salary",
      accessor: "salary",
      Cell: (row) => {
        return <div>{row?.cell?.value}</div>;
      },
    },

    {
      Header: "action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          {/* View Button */}
          {row.original.role === "employee" && (
            <Tooltip
              content="View"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="action-btn text-primary-500 bg-primary-200"
                type="button"
                onClick={() => actions[0].doit(row.original)}
              >
                <Icon icon="heroicons:eye" />
              </button>
            </Tooltip>
          )}

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
              onClick={() => actions[1].doit(row.original)}
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
              onClick={() => actions[2].doit(row.original)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const roleOptions = [
    { value: "all", label: "Select All" },
    { value: "admin", label: "Admin" },
    { value: "branchAdmin", label: "BranchAdmin" },
    { value: "employee", label: "Employee" },
  ];

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const filteredUsers = useMemo(() => {
    if (!selectedRole || selectedRole.value === "all") return users;
    return users.filter((user) => user.role === selectedRole.value);
  }, [selectedRole, users]);
  
  const actions = [
    {
      // View action
      doit: (item) => {
        console.log("Navigating to project with ID:", item._id); // Debug log
        navigate(`/attendance/${item._id}`, { state: { user: item } });
      },
      shouldDisplay: (item) => item.role === "employee", // Check if the user role is "employee"
    },
    {
      // name: "edit",
      // icon: "heroicons:pencil-square",
      doit: (item) => dispatch(editUserData(item)),
    },

    {
      // name: "delete",
      // icon: "heroicons-outline:trash",
      doit: (item) => {
        dispatch(deleteUser(item._id));

        setTimeout(() => {
          dispatch(getAllUsers("user"));
        }, 500);
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredUsers, [filteredUsers]);
  const tableInstance = useTable(
    {
      columns,
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
                    <h4 className="card-title">User List</h4>
                    <div className="flex gap-4 items-center">
                        <Select
                            className="react-select"
                            classNamePrefix="select"
                            value={selectedRole}
                            onChange={handleRoleChange}
                            options={roleOptions}
                            styles={styles}
                        />
                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    </div>
                </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
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
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className=" even:bg-slate-100 dark:even:bg-slate-700"
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
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

export default UserList;
