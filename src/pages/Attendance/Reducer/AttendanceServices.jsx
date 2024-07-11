import axios from "axios";
import { getToken } from "../../../configs/axiosConfig";
const baseUrl = import.meta.env.VITE_BASE_URL;

const addAttendance = async (data) => {
  const res = await axios.post(`${baseUrl}attendance/record`, data, getToken());
  return res.data;
};
const updateAttendance = async (userId, attendanceId, checkInTime, checkOutTime , reason) => {
  
  const res = await axios.put(
    `${baseUrl}attendance/update/${userId}/${attendanceId}`,
    { checkInTime, checkOutTime , reason },
    getToken()
  );
  console.log(res)
  return res.data;
};
const deleteAttendance = async (id) => {
  const res = await axios.delete(`${baseUrl}attendance/delete/${id}`, getToken());
  return res.data;
};
const getAttendance = async (userId) => {
  const res = await axios.get(`${baseUrl}attendance/${userId}`, getToken());
  return res.data;
};
// const getmonthlyAttendance = async(userId)
const AttendanceServices = {
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendance,
};

export default AttendanceServices;
