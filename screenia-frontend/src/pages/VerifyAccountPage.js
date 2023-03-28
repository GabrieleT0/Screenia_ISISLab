import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVerifyAccount } from "../api/authApi";

const VerifyAccountPage = () => {
    const { token } = useParams();
    const [isVerify, setIsVerify] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getVerifyAccount()
    }, []);

    const getVerifyAccount = async () => {
        if(!token) navigate("/");

        try {
            const response = await fetchVerifyAccount(token);

            if(response.status === 200) {
                setIsVerify(true);
            }
        } catch(e) {
            console.log('Error: ', e);
        }
    }

    return (
        isVerify 
            ? (<Typography>Your account has been successfully verified!</Typography>)
            : (<Typography>
                We were unable to verify the account! Please check that the link you received via email is valid.
            </Typography>)
    )
}

export default VerifyAccountPage;