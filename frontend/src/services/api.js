import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.request.use(
(config)=>{

    const token = localStorage.getItem("access");

    if (
        token &&
        !config.url.includes("/auth/login/")
    ) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
},
(error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;