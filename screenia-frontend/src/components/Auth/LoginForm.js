import { Button, Grid } from '@mui/material';
import { HookSelect, HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import { postComment } from '../../api/opereApi';
import { toast } from 'react-toastify';
import useLoader from '../../customHooks/loaderHooks/useLoader';
import { useEffect } from 'react';
import { fetchLogin } from '../../api/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '../../customHooks/localStorage/useLocalStorage';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../state/user/userAtom';
import InputAdornment from '@mui/material/InputAdornment';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import authTokenAtom from '../../state/authToken/authTokenAtom';
import jwtDecode from 'jwt-decode';
import sha256 from 'crypto-js/sha256';

const LoginForm = () => {
    const {registerState, setError, handleSubmit, getValues, setValue, formState: { errors }} = useHookForm({});
    const { setLoader } = useLoader();
    const navigate = useNavigate();
    const [userLocalStorage, setUserLocalStorage] = useLocalStorage("user", {});
    const [user, setUser] = useRecoilState(userAtom);
    const [authToken, setAuthToken] = useRecoilState(authTokenAtom);
    const location = useLocation();

    const onSubmit = async (data) => {
        try {
            setLoader();
            const response = await fetchLogin({
                ...data,
                password: sha256(data.password).toString()
            });

            if(!response?.data?.id) {
                throw new Error();
            }

            setAuthToken(response.data.accessToken);
            setUser(response.data);

            navigate(-1);
        } catch(e) {
            
            if(e.response && e.response?.data?.message) {
                if(e.response.status === 401) {
                    return toast.warning(`${e.response.data.message}`)
                }
                return toast.error(`${e.response.data.message}`)
            }

            return toast.error("The data entered is not correct!")
        } finally {
            setLoader();
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid sx={{ padding: 2 }} container spacing={2}>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('email')}
                        textFieldProps={{
                            label: 'Email',
                            variant: 'outlined',
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <AlternateEmailIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                <HookTextField 
                        {...registerState('password')}
                        textFieldProps={{
                            label: 'Password',
                            type: "password",
                            variant: 'outlined',
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <KeyIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ color: "#fff" }}>
                            Login
                        </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default LoginForm;