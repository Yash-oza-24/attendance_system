import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { getToken } from "../../../configs/axiosConfig"


const createLeave = async (leaveData) => {
  const response = await axios.post(`${baseUrl}leaves`, leaveData ,getToken());
  return response.data;
};

const getAllLeaves = async () => {
  const response = await axios.get(`${baseUrl}leaves` , getToken());
  return response.data;
};

const getPendingLeaves = async () => {
  const response = await axios.get(`${baseUrl}leaves/pending` , getToken());
  return response.data;
};

const getLeaveById = async (leaveId) => {
  const response = await axios.get(`${baseUrl}leaves/${leaveId}` , getToken());
  return response.data;
};

const updateLeave = async (leaveId, leaveData) => {
  const response = await axios.put(`${baseUrl}leaves/${leaveId}`, leaveData , getToken());
  return response.data;
};

const approveLeave = async (leaveId) => {
  const response = await axios.put(`${baseUrl}leaves/approve/${leaveId}` , getToken());
  return response.data;
};

const rejectLeave = async (leaveId) => {
  const response = await axios.put(`${baseUrl}leaves/reject/${leaveId}` , getToken());
  return response.data;
};

const deleteLeave = async (leaveId) => {
  const response = await axios.delete(`${baseUrl}leaves/${leaveId}` , getToken());
  return response.data;
};

const getemployeeLeave = async (employeeName) => {
  const res = await axios.get(`${baseUrl}leaves/employee-leaves/${employeeName}` , getToken())
  return res.data
}
export default {
  createLeave,
  getAllLeaves,
  getPendingLeaves,
  getLeaveById,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave,
  getemployeeLeave
};
