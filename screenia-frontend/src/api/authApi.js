import axios from "axios";
const service = `${process.env.REACT_APP_BACKEND_ENDPOINT}/auth`;

const authApi = axios.create({
    baseURL: service,
    headers: {
      'Accept': 'application/json',
      //'Authorization': 'token <your-token-here> -- https://docs.GitHub.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
    },
    withCredentials: true
});

const fetchLogin = async (body) => {
    return await authApi.post(`/login`, body);
}

const fetchCheckToken = async () => {
    return await authApi.get(`/check_token`);
}

const fetchLogout = async () => {
    return await authApi.post(`/logout`);
}

const fetchSignUp = async (body) => {
    return await authApi.post(`/sign-up`, {...body});
}

const fetchVerifyAccount = async (token) => {
    return await authApi.get(`/verify-account/${token}`);
}

export {
    fetchLogin,
    fetchCheckToken,
    fetchLogout,
    fetchSignUp,
    fetchVerifyAccount
}