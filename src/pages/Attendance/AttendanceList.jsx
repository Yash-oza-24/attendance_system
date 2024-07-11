import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import EditAttendance from "./EditAttendance";
import Card from "@/components/ui/Card";
import {
  deleteAttendance,
  getAttendance,
  editattendace,
} from "./Reducer/AttendanceSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import GlobalFilter from "./GlobalFilter";

const AttendanceList = forwardRef(({ data   }, ref) => {
  const MonthOptions = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];
  const {settings } = useSelector((state) => state.setting)
 
  const [selectedMonth, setSelectedMonth] = useState(
    MonthOptions[dayjs().month()]
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  const { control } = useForm({
    defaultValues: {
      month: MonthOptions[dayjs().month()],
    },
  });

  useEffect(() => {
    dispatch(getAttendance(id, selectedMonth.value));
  }, [dispatch, id, selectedMonth]);

  const filteredData = useMemo(() => {
    const today = dayjs().endOf("day");
    return data.filter((record) => {
      const recordDate = dayjs(record.date).toDate();
      const recordMonth = dayjs(recordDate).format("MMMM").toLowerCase();
      const recordYear = dayjs(recordDate).year();
      const selectedMonthName = selectedMonth.label.toLowerCase();
      const selectedYear = dayjs().year();
      // Only include records for the selected month and up to today
      return (
        recordMonth === selectedMonthName &&
        recordYear === selectedYear &&
        dayjs(recordDate).isBefore(today)
      );
    });
  }, [data, selectedMonth]);

  const fetchDataForSelectedMonth = (selectedMonthValue) => {
    const selectedMonthOption = MonthOptions.find(
      (option) => option.value === selectedMonthValue
    );
    setSelectedMonth(selectedMonthOption);
    dispatch(getAttendance(id, selectedMonthValue));
  };

  const isCurrentMonth =
    dayjs().format("MMMM").toLowerCase() === selectedMonth.label.toLowerCase();

  const COLUMNS = [
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ cell }) => <span>{dayjs(cell.value).format("DD-MM-YYYY")}</span>,
    },
    {
      Header: "Check-In Time",
      accessor: "checkInTime",
      Cell: ({ cell }) => <span>{dayjs(cell.value).format("HH:mm")}</span>,
    },
    {
      Header: "Check-Out Time",
      accessor: "checkOutTime",
      Cell: ({ cell }) => <span>{dayjs(cell.value).format("HH:mm")}</span>,
    },
    {
      Header: "Re-mark",
      accessor: "reason",
      Cell: ({ cell }) => <span>{cell.value}</span>,
    },
    {
      Header: "Late Time",
      accessor: "lateTime",
      Cell: ({ cell }) => {
        if (cell.value) {
          const lateTime = dayjs(cell.value).format("HH:mm A");
          return <span>{lateTime}</span>;
        } else {
          return <span>00:00</span>;
        }
      },
    },
    {
      Header: "Over Time",
      accessor: "overTime",
      Cell: ({ cell }) => {
        if (cell.value) {
          const overTime = dayjs(cell.value).format("HH:mm A");
          return <span>{overTime}</span>;
        } else {
          return <span>00:00</span>;
        }
      },
    },
    {
      Header: "Daily Working Hours",
      accessor: "dailyWorkingHours",
      Cell: ({ cell }) => <span>{parseFloat(cell.value).toFixed(0)}</span>,
    },    
    {
      Header: "Daily Salary",
      accessor: "dailySalary",
      Cell: ({ cell }) => <span>{parseFloat(cell.value).toFixed(0)}</span>,
    },
  ];

  if (isCurrentMonth) {
    COLUMNS.push({
      Header: "Action",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button
              className="action-btn text-success-700 bg-success-200"
              type="button"
              onClick={() => actions[0].doit(row.original)}
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
              onClick={() => actions[1].doit(row.original)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    });
  }

  const actions = [
    {
      doit: (item) => dispatch(editattendace(item), console.log(item)),
    },
    {
      doit: (item) => {
        dispatch(deleteAttendance(item._id));
        setTimeout(() => {
          dispatch(getAttendance(id));
        }, 500);
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, [isCurrentMonth]);
  const tableInstance = useTable(
    {
      columns,
      data: filteredData,
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

  const totalDailyWorkingHours = useMemo(
    () =>
      filteredData
        .reduce(
          (total, row) => total + parseFloat(row.dailyWorkingHours || 0),
          0
        )
        .toFixed(0),[filteredData]
  );

  const totalDailySalary = useMemo(
    () =>
      filteredData
        .reduce((total, row) => total + parseFloat(row.dailySalary || 0), 0)
        .toFixed(0),
    [filteredData]
  );
  // console.log(set)
  const daysAttended = filteredData.length;
  const workingDaysInMonth = settings.totalDaysInMonth;
  const attendancePercentage = ((daysAttended / workingDaysInMonth) * 100).toFixed(2);

  useImperativeHandle(ref, () => ({
    getFilteredData: () => filteredData,
  }));

  return (
    <Card noborder>
      <div className="md:flex justify-between items-center mb-6">
        <div className="flex justify-between items-center">
          <h4 className="card-title">Current Month Attendance</h4>
        </div>
        <div className="flex justify-between ">
          <div className="flex gap-2 mr-3">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
          <div>
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <Select
                  id="month"
                  className="react-select"
                  classNamePrefix="select"
                  options={MonthOptions}
                  value={selectedMonth}
                  {...field}
                  styles={{
                    option: (provided) => ({ ...provided, fontSize: "14px" }),
                  }}
                  onChange={(selected) => {
                    field.onChange(selected);
                    fetchDataForSelectedMonth(selected.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table
              className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              {...getTableProps()}
            >
              <thead className="bg-slate-100 dark:bg-slate-700">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        scope="col"
                        className="table-th"
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
                      className="even:bg-slate-100 dark:even:bg-slate-700"
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
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm font-medium">
            Total Working Hours: {totalDailyWorkingHours}
          </span>
        </div>
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm font-medium">
            Total Salary: {totalDailySalary}
          </span>
        </div>
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm font-medium">
            Attendance Percentage (Monthly): {attendancePercentage}%
          </span>
        </div>
        <div>
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
      </div>
    </Card>
  );
});

export default AttendanceList;
