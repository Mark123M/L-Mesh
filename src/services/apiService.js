import axios from "axios";

const baseUrl = "/api";

export const apiService = {
    get: (url) => axios.get(baseUrl + url),
    post: (url, data) => axios.post(baseUrl + url, data),
    put: (url, data) => axios.put(baseUrl + url, data),
    delete: (url) => axios.delete(baseUrl + url)
}