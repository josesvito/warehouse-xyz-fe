// import config from 'config';
// import { authHeader } from '../_helpers';
import axios from "axios";
import store from "../store";

export const userService = {
  login,
  updateProfile,
  logout,
};

async function login(username, password) {
  try {
    const response = await axios.post(process.env.VUE_APP_API_URL + "users/session/login", {
      username,
      password
    })
    setToken(response.data);
    return response;
  } catch (error) {
    removeToken(error);
    return error.response;
  }
}

function setToken(user) {
  store.dispatch("login", user["values"]);
  return user["values"]["token"];
}

function removeToken(error) {
  store.dispatch("logout");
  return error;
}

async function updateProfile(data) {
  try {
    const response = await axios.patch(
      process.env.VUE_APP_API_URL + "users/profile/" + data.id, data, {
        headers: {
          token: store.getters.getToken,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

async function logout() {
  const token = store.getters.getToken;
  try {
    const response = await axios.post(
      process.env.VUE_APP_API_URL + "users/session/logout", {
        headers: {
          api_key: process.env.VUE_APP_API_KEY,
          token: token ? token : localStorage.getItem("token"),
        },
      }
    );
    store.dispatch("logout");
    return response;
  } catch (error) {
    console.error(error);
    return error.response;
  }
}