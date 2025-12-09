import axios from "axios";

const ApiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers:{
        "Content-Type":"application/json"
    }
});

ApiClient.interceptors.request.use(
    (config : any) => {
        const token = localStorage.getItem("AuthToken");

        if (token) {
            config.headers = config.headers || {}

            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default ApiClient