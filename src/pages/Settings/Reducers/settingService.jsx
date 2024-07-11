import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { getToken } from "../../../configs/axiosConfig";

const addData = async (data) => {
  const res = await axios.post(`${baseUrl}settings/addOrUpdate`, data, getToken());
  return res.data;
};

const updateData = async ({ data }) => {
  const res = await axios.put(
    `${baseUrl}settings/update/${data?.id}`,
    data?.data,
    getToken()
  );
  return res.data;
};
const deleteData = async (data) => {
  const res = await axios.delete(
    `${baseUrl}settings/delete/${data?.id}`,
    data?.data,
    getToken()
  );
  return res.data;
};
const getData = async (data) => {
  const res = await axios.get(`${baseUrl}settings/getsetting`, getToken());
  return res.data;
};

const settingService = {
  addData,
  updateData,
  deleteData,
  getData,
};

export default settingService;
