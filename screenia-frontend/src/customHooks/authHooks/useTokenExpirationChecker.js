import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import authTokenAtom from '../../state/authToken/authTokenAtom';
import { userAtom } from '../../state/user/userAtom';

function isTokenExpired(token) {
    const decodedToken = jwtDecode(token, { complete: true });
    const expirationTime = decodedToken.exp;
    const currentTime = Date.now() / 1000; // converti in second
    return expirationTime < currentTime;
}

function useTokenExpirationChecker() {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useRecoilState(authTokenAtom);
    const [user, setUser] = useRecoilState(userAtom);

    useEffect(() => {
      if(!authToken) return;

      const intervalId = setInterval(() => {
        if (isTokenExpired(authToken)) {
          navigate("/login");
          toast.warning("Your session has expired! Log in again to continue your session.");
          setAuthToken(null);
          setUser(null);
        }
      }, 60 * 1000);

      return () => clearInterval(intervalId);
    }, [authToken, setAuthToken]);
}

export default useTokenExpirationChecker;
