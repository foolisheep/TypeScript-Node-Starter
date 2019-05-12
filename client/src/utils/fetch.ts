import NetworkError from "../models/NetworkError";
import { ACCESS_TOKEN_KEY } from "../constants";

const API_URL = `http://localhost:3000`; // TODO: switch between debug and product

export type Method = "GET" | "POST";

const _fetch = (url: string, body: any, method: Method, withToken?: boolean): Promise<any> => {
    const headers: any = {
        "Content-Type": "application/json"
    };
    if (withToken) {
        headers["Authorization"] = "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    const options: any = {
        method: method,
        headers: headers,
        redirect: "follow", // manual, *follow, error
    };
    if (method === "POST") {
        options["body"] = JSON.stringify(body);
    }
    return fetch(`${API_URL}${url}`, options).then((response: Response) => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText
            } as NetworkError);
        }
    });
};

export default _fetch;