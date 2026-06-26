import { axiosInstance } from "./axios";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/login", {
    email,
    password,
  });

  // 🔥 SAVE TOKEN
  if (response.data?.token) {
    // remove old cached data
    localStorage.removeItem("cms4.currentUser.v1");
    localStorage.removeItem("cms4.websiteSettings.v1");
    
    localStorage.setItem("auth_token", response.data.token);
  }

  return response.data;
};
