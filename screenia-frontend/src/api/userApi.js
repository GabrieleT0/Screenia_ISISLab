import axios from "axios";
const service = `${process.env.REACT_APP_BACKEND_ENDPOINT}/user`;

const userApi = axios.create({
    baseURL: service,
    headers: {
      'Accept': 'application/json',
      //'Authorization': 'token <your-token-here> -- https://docs.GitHub.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
    },
    withCredentials: true,
    credential: true
});

const fetchUsersToApprove = () => {
    return userApi.get(`/usersToApprove`);
}

const fetchPostApprovalUsers = (ids) => {
    
    return userApi.post(`/approval`, { idUsers: [...ids] });
}

export {
    fetchUsersToApprove,
    fetchPostApprovalUsers
}