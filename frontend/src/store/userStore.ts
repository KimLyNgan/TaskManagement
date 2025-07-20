import { create } from "zustand";
import api from "@/app/lib/axios";
import { message } from "antd";

export interface UserProfile {
   _id: string;
   username: string;
   email: string;
   password: string;
   role: string;
   createdAt: string;
   updatedAt: string;
}

export interface LoginPayLoad {
   email: string;
   password?: string;
}

export interface RegisterPayLoad {
   username?: string;
   email: string;
   password?: string;
}

interface UserState {
   isAuthenticated: boolean;
   user: UserProfile | null;
   loading: boolean;
   error: string | null;
   login: (payload: LoginPayLoad) => Promise<boolean>;
   register: (payload: RegisterPayLoad) => Promise<boolean>;
   fetchProfile: () => Promise<boolean>;
   logout: () => Promise<void>;
   resetState: () => void;
}

export const useUserStore = create<UserState>((set) => ({
   //Initial State
   isAuthenticated: false,
   user: null,
   loading: false,
   error: null,
   //Actions
   login: async (payload) => {
      console.log("goi ham login");
      console.log(payload);
      set({ loading: true, error: null });
      try {
         const response = await api.post("/auth/login", payload);
         set({ isAuthenticated: true, loading: false });
         message.success(response.data.message || "Đăng nhập thành công!");
         return true;
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || "Đăng nhập thất bại!";
         console.log(error);
         set({ loading: false, error: errorMessage, isAuthenticated: false, user: null });
         message.error(errorMessage);
         return false;
      }
   },
   register: async (payload) => {
      set({ loading: true, error: null });
      try {
         const response = await api.post("/auth/register", payload);
         set({ loading: false });
         message.success(response.data.message || "Đăng ký thành công!");
         return true;
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || "Đăng ký thay bại!";
         set({ loading: false, error: errorMessage });
         message.error(errorMessage);
         return false;
      }
   },
   fetchProfile: async () => {
      set({ loading: true, error: null });
      try {
         const response = await api.get<UserProfile>("/auth/profile");
         set({ isAuthenticated: true, loading: false, user: response.data });
         return true;
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || "Lấy thông tin người dùng thất bại!";
         if (error.response?.status == 401) {
            set({ isAuthenticated: false, user: null, loading: false, error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
         } else {
            set({ isAuthenticated: false, user: null, loading: false, error: errorMessage });
            message.error(errorMessage);
         }
         return false;
      }
   },
   logout: async () => {
      set({ loading: true, error: null });
      try {
         const response = await api.post("/auth/logout");
         set({ isAuthenticated: false, user: null, loading: false });
         message.success(response.data.message || "Đăng xuất thành công!");
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || "Đăng xuất thay bại!";
         set({ loading: false, error: errorMessage });
         message.error(errorMessage);
      }
   },
   resetState: () => {
      set({
         isAuthenticated: false,
         user: null,
         loading: false,
         error: null,
      });
   },
}));
