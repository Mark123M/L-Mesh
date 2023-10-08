import axios from "axios";

const baseUrl = `/api`;

export const apiService = {
    get: (url) => axios.get(baseUrl + url + '/'),
    post: (url, data) => axios.post(baseUrl + url + '/', data),
    put: (url, data) => axios.put(baseUrl + url + '/', data),
    delete: (url) => axios.delete(baseUrl + url + '/')
}

export const getCookie = (key) => {
    const regex = new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*=\\s*([^;]*).*$)|^.*$`);
    console.log(document.cookie.replace(regex, "$1"));
    return document.cookie.replace(regex, "$1");
}