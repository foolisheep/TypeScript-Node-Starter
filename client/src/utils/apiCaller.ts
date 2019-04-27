import fetch from "isomorphic-fetch";
import RequestResult from "../models/RequestResult";

export const API_URL = `http://localhost:${process.env.PORT}/api`; // TODO: switch between debug and product

function callApi(endpoint: string, method = "get", body: any): Promise<RequestResult> {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: { "content-type": "application/json" },
    method,
    body: JSON.stringify(body),
  }).then(
    (response: Response) => response.json().then(
      json => ({ json, response })
    )
  ).then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  }).then(
    response => response,
    error => error
  );
  // TODO: catch
}

export function get(endpoint: string, body: any): Promise<RequestResult> {
  return callApi(endpoint, "get", body);
}

export function post(endpoint: string, body: any): Promise<RequestResult> {
  return callApi(endpoint, "post", body);
}
