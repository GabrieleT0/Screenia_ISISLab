const nodemailer = require('nodemailer');
const retry = require('retry');
import credentials from "../../utils/mail/credentials";
import templateApprovedAccount from "../../utils/mail/template/templateApprovedAccount";
import templateVerifyAccount from "../../utils/mail/template/templateVerifyAccount";
const transporter = nodemailer.createTransport(credentials)

const operation = retry.operation({
    retries: 3, // numero di tentativi di invio
    factor: 3, // fattore di backoff esponenziale
    minTimeout: 1000, // timeout minimo tra i tentativi
    maxTimeout: 3000 // timeout massimo tra i tentativi
});

const sendMailVerifyAccount = (userEmail, token, name) => {
    if(!userEmail || !token) {
        throw new Error("Email and Token Required!");
    }

    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: userEmail,
            subject: 'Thank you for registering on our platform!',
            html: templateVerifyAccount({ 
                link: `${process.env.ENDPOINT_CLIENT}/verify_account/${token}`,
                username: `${name}`
            })
        };

        //Effettua il tentativo di invio email per 3 volte se c'è un errore
        operation.attempt((currentAttempt) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    if (operation.retry(error)) {
                        return;
                    }
                    
                    return;
                }
            });
        });
    } catch(error) {
        throw new Error(error);
    }
}

const sendMailApprovedAccount = (userEmail, name) => {
    if(!userEmail) {
        throw new Error("Email and Token Required!");
    }

    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: userEmail,
            subject: 'Your account has been approved!!',
            html: templateApprovedAccount({
                username: `${name}`,
                link: `${process.env.ENDPOINT_CLIENT}/login`,
            })
        };

        //Effettua il tentativo di invio email per 3 volte se c'è un errore
        operation.attempt((currentAttempt) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    if (operation.retry(error)) {
                        return;
                    }
                    
                    return;
                }
            });
        });
    } catch(error) {
        throw new Error(error);
    }
}

const MailService = {
    sendMailVerifyAccount,
    sendMailApprovedAccount
}

export default MailService;