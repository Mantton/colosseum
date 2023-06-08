import axios from "axios";
import { isProduction } from "./utils";

const api = axios.create({
  baseURL: isProduction() ? "/api" : "http://localhost:5000",
  withCredentials: true,
});

export default api;
