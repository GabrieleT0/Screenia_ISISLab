// The credentials for the email account you want to send mail from. 
const credentials = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // These environment variables will be pulled from the .env file
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS  
  }
}

export default credentials;