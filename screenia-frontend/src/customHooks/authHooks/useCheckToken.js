import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { fetchCheckToken } from "../../api/authApi";
import { userAtom } from "../../state/user/userAtom";
import useLoader from "../loaderHooks/useLoader";
import useLocalStorage from "../localStorage/useLocalStorage";

const useCheckToken = () => {
    const [isCheckToken, setIsCheckToken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [ userLocalStorage, setUserLocalStorage ] = useLocalStorage("user");
    const [ userData, setUserData ] = useRecoilState(userAtom);
    const { setLoader } = useLoader();


    useEffect(() => {
        loadDataUser();
    }, []);

    const loadDataUser = async () => {

        try {
            setLoading(true);
            const response = await fetchCheckToken();
            
            setIsCheckToken(true);

            if(!userLocalStorage || !userLocalStorage.id) {
                setUserLocalStorage({ ...response.data });
            }

            if(!userData.id) {
                setUserData({ ...response.data });
            }
        } catch(e) {
            setUserLocalStorage({});
            setUser({});
            return navigate("/login");
        } finally {
            setLoading(false);
        }
    }

    return {
        isCheckToken,
        loading
    };
}

export default useCheckToken;