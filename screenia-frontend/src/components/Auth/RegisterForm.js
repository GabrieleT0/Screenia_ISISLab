import { Button, Grid } from '@mui/material';
import { HookSelect, HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import { postComment } from '../../api/opereApi';
import { toast } from 'react-toastify';
import useLoader from '../../customHooks/loaderHooks/useLoader';
import { useEffect } from 'react';
import { validate as validateEmail } from 'react-email-validator';
import InputAdornment from '@mui/material/InputAdornment';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import FaceIcon from '@mui/icons-material/Face';
import Face6Icon from '@mui/icons-material/Face6';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RepeatIcon from '@mui/icons-material/Repeat';
import { fetchSignUp } from '../../api/authApi';

const RegisterForm = ({ handleAfterRegister }) => {
    const {registerState, setError, handleSubmit, getValues, setValue, formState: { errors }} = useHookForm({});
    const { setLoader } = useLoader();

    const onSubmit = async (data) => {
        try {
            setLoader();
            await fetchSignUp(data);
            toast.success("Your account has been registered to the platform and will go through an approval process!");
            handleAfterRegister();
        } catch(e) {
            if(e?.response?.data?.message) {
                return toast.error(`${e.response.data.message}`);
            }
            console.log('Error', e);
            return toast.error("Impossibile inviare i dati. Contattare l'amministrazione!")
        } finally {
            setLoader();
        }
    }

    const validateCustomEmail = (email) => {
        if(!validateEmail(email)) {
            return 'The field does not contain a valid email address!';
        }

        return null;
    }

    const validatePassword = (psw) => {
        /**
            La stringa deve contenere almeno 1 carattere alfabetico minuscolo
            La stringa deve contenere almeno 1 carattere alfabetico maiuscolo
            La stringa deve contenere almeno 1 carattere numerico
            La stringa deve contenere almeno un carattere speciale, ma evadiamo i caratteri RegEx riservati per evitare conflitti
            La stringa deve contenere almeno otto caratteri
        */
        const strongRegex = new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
        );

        if(!strongRegex.test(psw)) {
            return 'The password must contain at least eight characters, at least one uppercase character, at least one numeric character, at least one special character!';
        }

        return null;
    }

    const validateRepeatPassword = (repeatPsw, psw) => {
        console.log('psw', psw)
        if(repeatPsw.trim().toLowerCase() !== psw.trim().toLowerCase()) {
            return 'The passwords do not match!';
        }

        return null;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid sx={{ padding: 2 }} container spacing={2}>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('email')}
                        label="Email"
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
                            },
                            validate: validateCustomEmail
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('name')}
                        label="Name"
                        textFieldProps={{
                            label: 'Name',
                            variant: 'outlined',
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <FaceIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            },
                            minLength: {
                                value: 3,
                                message: 'Please enter at least 3 characters'
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('surname')}
                        label="Surname"
                        textFieldProps={{
                            label: 'Surname',
                            variant: 'outlined',
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <Face6Icon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            },
                            minLength: {
                                value: 3,
                                message: 'Please enter at least 3 characters'
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                            {...registerState('password')}
                            textFieldProps={{
                                label: 'Password',
                                variant: 'outlined',
                                type: "password",
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
                                },
                                validate: validatePassword
                            }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('password_repeat')}
                        label="Repeat Password"
                        textFieldProps={{
                            label: 'Repeat Password',
                            variant: 'outlined',
                            type: "password",
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <RepeatIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            },
                            validate: (repeatPsw) => validateRepeatPassword(repeatPsw, getValues('password'))
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('otherInfo')}
                        textFieldProps={{
                            label: 'Description of your CV',
                            variant: 'outlined',
                            fullWidth: true,
                            multiline: true,
                            rows: 4,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <AssignmentIndIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            }, 
                            minLength: {
                                value: 15,
                                message: 'Please enter at least 15 characters'
                            },
                            maxLength: {
                                value: 512,
                                message: 'Please enter at least 512 characters'
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
                            Register
                        </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default RegisterForm;