import axios from "axios";
const service = "http://localhost:3001/user";

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
    console.log('ids', ids)
    return userApi.post(`/approval`, { idUsers: [...ids] });
}

export {
    fetchUsersToApprove,
    fetchPostApprovalUsers
}