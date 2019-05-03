import NetworkError from "../models/NetworkError";

const API_URL = `http://localhost:3000`; // TODO: switch between debug and product

const _fetch = (url: string, body: any, method: string, withToken?: boolean): Promise<any> => {
    return fetch(`${API_URL}${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow", // manual, *follow, error
        body: JSON.stringify(body),
    }).then((response: Response) => {
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