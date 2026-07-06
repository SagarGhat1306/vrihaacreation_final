// single place for all API calls — fetch() only, as requested
export const BASE_URL = "https://vrihacreation-backend.vercel.app";

const getToken = () => localStorage.getItem("token") || "";

// GET with token
export const apiGet = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { token: getToken() },
  });
  return res.json();
};

// POST json with token
export const apiPost = async (path, body = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getToken(),
    },
    body: JSON.stringify(body),
  });
  return res.json();
};



// POST FormData (images) with token — don't set Content-Type, browser does it
export const apiPostForm = async (path, formData) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { token: getToken() },
    body: formData,
  });
  return res.json();
};
