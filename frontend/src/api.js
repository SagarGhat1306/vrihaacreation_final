// single place for all frontend API calls — fetch() only
export const BASE_URL = import.meta.env.VITE_BACKEND || "http://localhost:5000";

// GET (token optional)
export const apiGet = async (path, token = "") => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { token } : {},
  });
  return res.json();
};

// POST json (token optional)
export const apiPost = async (path, body = {}, token = "") => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
    },
    body: JSON.stringify(body),
  });
  return res.json();
};

// product images are stored as { url, public_id } — this works for both formats
export const imgUrl = (img) => img?.url || img;
