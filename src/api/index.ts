import axios from "axios";
import history from "./history";
import node from "./node";
import user from "./user";
import vendor from "./vendor";

// axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.baseURL = "https://billing-api-production.up.railway.app/api";

export function setAuthToken(token: string) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const Node = node;
export const Vendor = vendor;
export const History = history;
export const User = user;
