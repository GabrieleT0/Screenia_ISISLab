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
import sha256 from 'crypto-js/sha256';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';

const RegisterForm = ({ handleAfterRegister }) => {
    const {registerState, setError, handleSubmit, getValues, setValue, formState: { errors }} = useHookForm({});
    const { setLoader } = useLoader();
    const onSubmit = async (data) => {
        try {
            setLoader();
            
            await fetchSignUp({
                ...data,
                password: sha256(data.password).toString(),
                password_repeat:  sha256(data.password_repeat).toString()
            });
            toast.success("Your account has been registered to the platform and will go through an approval process!");
            handleAfterRegister();
        } catch(e) {
            if(e?.response?.data?.message) {
                return toast.error(`${e.response.data.message}`);
            }
            
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
        if(repeatPsw.trim().toLowerCase() !== psw.trim().toLowerCase()) {
            return 'The passwords do not match!';
        }

        return null;
    }

    const validateSocialURL = (url = null, social = "") => {
        if(!url) return null;

        const fbUrlRegex = /^https?:\/\/(?:www\.)?facebook\.com\/(?:\w+\/)*\w+(?:\/)?$/;
        const twitterUrlRegex = /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?\w+(?:\/)?$/;
        const linkedinUrlRegex = /^https?:\/\/(?:[\w]+\.)?linkedin\.com\/in\/(?:[\w-]+\/?)?(?:\?.*)?$/;

        if(social === "facebook" && !fbUrlRegex.test(url)) {
            return "The link is not correct!";
        } else if(social === "twitter" && !twitterUrlRegex.test(url)) {
            return "The link is not correct!";
        } else if(social === "linkedin" && !linkedinUrlRegex.test(url)) {
            
            return "The link is not correct!";
        }
      
        return null;
    }

    const validatePersonalSite = (url) => {
        if(!url) return;

        const websiteUrlRegex = /^https?:\/\/(?:[\w]+\.)?[\w-]+\.[\w]{2,6}(?:\/\S*)?$/;

        if(!websiteUrlRegex.test(url)) {
            return "The link is not correct!";
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
                        {...registerState('facebook_profile')}
                        label="Facebook profile link"
                        textFieldProps={{
                            label: 'Facebook profile link',
                            variant: 'outlined',
                            type: "text",
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <Facebook color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            validate: (url) => validateSocialURL(url, "facebook")
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('twitter_profile')}
                        label="Twitter profile link"
                        textFieldProps={{
                            label: 'Twitter profile link',
                            variant: 'outlined',
                            type: "text",
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <Twitter color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            validate: (url) => validateSocialURL(url, "twitter")
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('linkedin_profile')}
                        label="Linkedin profile link"
                        textFieldProps={{
                            label: 'Linkedin profile link',
                            variant: 'outlined',
                            type: "text",
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <LinkedIn color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            validate: (url) => validateSocialURL(url, "linkedin")
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('personal_site')}
                        label="Personal site link"
                        textFieldProps={{
                            label: 'Personal site link',
                            variant: 'outlined',
                            type: "text",
                            fullWidth: true,
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                      <HomeIcon color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                        rules={{
                            validate: (url) => validatePersonalSite(url)
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
                                value: 150,
                                message: 'Please enter at least 150 characters'
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