import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { getToken } from "../../../configs/axiosConfig"

const addEmployee = async (data) => {
    const res = await axios.post(`${baseUrl}employee/addemployee`, data );
    return res.data
};

const employeeLogin = async (data) => {
    const res = await axios.post(`${baseUrl}employee/employeelogin`, data);
    return res.data
}

const getAllEmployee = async () => {
    const res = await axios.get(`${baseUrl}users/allemployees` , getToken());
    return res.data
}

const deleteEmployee = async (userId) => {
    const res = await axios.delete(`${baseUrl}users/${userId}` , getToken());
    return res.data
}

const updateEmployee = async (data) => {
    const res = await axios.put(`${baseUrl}employee/updateemployee/${data?.id}`, data?.data);
    return res.data
}
const updateUser = async (data) => {
    console.log(data)
    const res = await axios.put(`${baseUrl}users/${data?.id}`, data?.data, getToken());
    return res.data
  }
const EmployeeService = {
    addEmployee,
    employeeLogin,
    getAllEmployee,
    deleteEmployee,
    updateEmployee,
    updateUser
}

export default EmployeeService