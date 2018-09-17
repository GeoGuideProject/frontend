import axios from "axios";

import { GEOGUIDE_API_URL, AUTH_KEY } from "../constants";

const instance = axios.create({ baseURL: GEOGUIDE_API_URL });

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem(AUTH_KEY);

    if (token) {
      config.headers["Authorization"] = `JWT ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

export const me = () => instance.get("/api/v1/me");

export const token = ({ email, password }) =>
  instance.post("/api/v1/token", { email, password });

export const tokenRefresh = ({ token }) =>
  instance.post("/api/v1/token/refresh", { token });

export const register = ({ email, password, confirmPassword }) =>
  instance.post("/api/v1/register", {
    email,
    password,
    confirmPassword
  });

export const datasets = () => instance.get("/api/v1/datasets");
