const BASE = "/api/backend";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  listComponents: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/components${qs ? `?${qs}` : ""}`);
  },
  getComponent: (slug) => request(`/components/${slug}`),
  myComponents: (token) => request("/components/mine/list", { token }),

  createComponent: (token, payload) =>
    request("/components", { method: "POST", token, body: payload }),
  updateComponent: (token, id, payload) =>
    request(`/components/${id}`, { method: "PUT", token, body: payload }),
  deleteComponent: (token, id) =>
    request(`/components/${id}`, { method: "DELETE", token }),
};
