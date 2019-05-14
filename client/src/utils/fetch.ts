import NetworkError from "../models/HttpError";
import { ACCESS_TOKEN_KEY } from "../constants";

const API_URL = `http://localhost:3000`; // TODO: switch between debug and product

export type Method = "GET" | "POST";

const _fetch = (url: string, body: any, method: Method, withToken?: boolean, followRedirect?: boolean): Promise<any> => {
    const headers: any = {
        "Content-Type": "application/json"
    };
    if (withToken) {
        headers["Authorization"] = "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    const options: any = {
        method: method,
        headers: headers,
    };
    if (method === "POST") {
        options.body = JSON.stringify(body);
    }
    if (followRedirect) {
        options.redirect = "follow";
    }
    return fetch(`${API_URL}${url}`, options).then((response: Response) => {
        if (!followRedirect && response.redirected) {
            // Manually handle redirect
            window.location.href = response.url;
            return { redirected: true };
        } else if (response.ok) {
            return response.json();
        } else {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText,
                message: response.json(),
            } as NetworkError);
        }
    });
};

export default _fetch;