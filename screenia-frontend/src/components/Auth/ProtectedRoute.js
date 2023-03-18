import { Navigate, Route, useNavigate } from "react-router-dom";
import useCheckToken from "../../customHooks/authHooks/useCheckToken";
import jwtDecode from 'jwt-decode';
import { useRecoilState } from 'recoil';
import authTokenAtom from "../../state/authToken/authTokenAtom";
import { fetchLogout } from "../../api/authApi";
import { useEffect } from "react";
import { userAtom } from "../../state/user/userAtom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const [authToken, setAuthToken] = useRecoilState(authTokenAtom);
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    function isTokenExpired(token) {
        const decodedToken = jwtDecode(token, { complete: true });
        const expirationTime = decodedToken.exp;
        const currentTime = Date.now() / 1000; // converti in second
        console.log('expirationTime < currentTime', expirationTime < currentTime)
        return expirationTime < currentTime;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isTokenExpired(authToken)) {
                navigate("/login");
                setAuthToken(null); // il token JWT è scaduto, quindi fai logout dell'utente
                setUser(null);
            }
            }, 60 * 1000); // esegui il controllo ogni minuto (60 secondi * 1000 millisecondi)

        return () => clearInterval(intervalId); // cancella l'intervallo quando il componente viene smontato
    }, [authToken, setAuthToken]);

    if(authToken && allowedRoles.length > 0 && allowedRoles.includes(user.role)) {
      console.log('sto in if')
      return children;
    }

    return (<Navigate to="/login" replace />)
};

export default ProtectedRoute;