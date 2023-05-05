import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { fetchLogout } from "../../api/authApi";
import useLoader from "../../customHooks/loaderHooks/useLoader";
import useLocalStorage from "../../customHooks/localStorage/useLocalStorage";
import authTokenAtom from "../../state/authToken/authTokenAtom";
import { userAtom } from "../../state/user/userAtom";

const Logout = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const [authToken, setAuthToken] = useRecoilState(authTokenAtom);

    const { setLoader } = useLoader();
    useEffect(() => {
        logout();
    }, [])

    const logout = async () => {
        try {
            setLoader();
            await fetchLogout();
            setAuthToken(null);
            setUser(null);
        } catch(e) {
            
        } finally {
            setLoader();
        }
    }

    if(!authToken) {
        return <Navigate to="/login" replace />;
    }

    return null;
}

export default Logout;