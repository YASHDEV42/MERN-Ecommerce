import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });

      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  signin: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/signin", { email, password });

      console.log(res.data);
      console.log(res.data.user);
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/profile");
      console.log("data from useUserStore: ", res.data);

      set({ user: res.data, checkingAuth: false });
    } catch (e) {
      set({ checkingAuth: false });
      console.log(e);
    }
  },

  logout: async () => {
    set({ loading: true });

    try {
      console.log("logging out");

      await axios.post("/auth/signout");
      console.log("request sent");

      set({ user: null, loading: false });
      console.log("done");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
