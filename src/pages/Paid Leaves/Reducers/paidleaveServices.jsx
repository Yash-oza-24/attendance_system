import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { getToken } from "../../../configs/axiosConfig";

const addPaidleave = async (data) => {
  const res = await axios.post(`${baseUrl}paidleaves`, data, getToken());
  return res.data;
};
const getPaidleave = async (data) => {
  const res = await axios.get(`${baseUrl}paidleaves`, getToken());
  return res.data;
};
const getPaidleavebyId = async (data) => {
  const res = await axios.get(`${baseUrl}paidleaves/${data}`, getToken());
  return res.data;
};
const updatePaidleave = async (data) => {
  console.log(data)
  const res = await axios.put(`${baseUrl}paidleaves/${data?.id}`, data, getToken());
  return res.data;
};
const deletePaidleave = async (data) => {
  const res = await axios.delete(`${baseUrl}paidleaves/${data}`, getToken());
  return res.data;
};


const paidleavesServices = {
    addPaidleave,
    getPaidleave,
    getPaidleavebyId,
    updatePaidleave,
    deletePaidleave
}

export default paidleavesServices
