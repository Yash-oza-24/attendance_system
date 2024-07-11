import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { getToken } from "../../../configs/axiosConfig"


const addUser = async (data) => {
    const res = await axios.post(`${baseUrl}users/add`, data, getToken());
    return res.data
};

const userLogin = async (data) => {
    const res = await axios.post(`${baseUrl}users/login`, data);
    return res.data
}

const getAllUsers = async () => {
    const res = await axios.get(`${baseUrl}users/all`, getToken());
    return res.data
}

const getUserById = async (data) => {
    const res = await axios.get(`${baseUrl}users/${data}`, getToken());
    return res.data
}

const deleteUser = async (data) => {
    const res = await axios.delete(`${baseUrl}users/${data}`, getToken());
    return res.data
}

const updateUser = async (data) => {
    const res = await axios.put(`${baseUrl}users/${data?.id}`, data?.data, getToken());
    return res.data
}

const UserService = {
    addUser,
    userLogin,
    getAllUsers,    
    getUserById,
    deleteUser,
    updateUser
}

export default UserService
