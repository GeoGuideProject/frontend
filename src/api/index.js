import axios from "axios";

import { GEOGUIDE_API_URL } from "../constants";

const instance = axios.create({ baseURL: GEOGUIDE_API_URL });

export const me = () => instance.get("/api/me");

export const token = ({ email, password }) =>
  instance.post("/api/token", { email, password });

export const tokenRefresh = ({ token }) =>
  instance.post("/api/token/refresh", { token });

export const register = ({ email, password, confirmPassword }) =>
  instance.post("/api/register", {
    email,
    password,
    confirm_password: confirmPassword
  });
