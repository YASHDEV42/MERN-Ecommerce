import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  //   baseURL:
  //     import.meta.mode === "development" ? "http://localhost:3000" : "/api",
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
