import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { getToken } from "../../../configs/axiosConfig";

const addBranches = async (data) => {
  const res = await axios.post(`${baseUrl}Branches/addBranches`, data);
  return res.data;
};

const BranchesLogin = async (data) => {
  const res = await axios.post(`${baseUrl}Branches/Brancheslogin`, data);
  return res.data;
};

const getAllBranches = async () => {
  const res = await axios.get(`${baseUrl}users/allbranches`, getToken());
  return res.data;
};

const deleteBranches = async (userId) => {
  const res = await axios.delete(`${baseUrl}users/${userId}` , getToken());
  return res.data;
};

const updateBranches = async (userId) => {
  const res = await axios.put(
    `${baseUrl}users/${userId}`,
    data?.data
    ,
    getToken()
  );
  return res.data;
};
const updateUser = async (data) => {
  console.log(data)
  const res = await axios.put(`${baseUrl}users/${data?.id}`, data?.data, getToken());
  return res.data
}



const BranchesService = {
  addBranches,
  BranchesLogin,
  getAllBranches,
  deleteBranches,
  updateBranches,
  updateUser
};

export default BranchesService;
