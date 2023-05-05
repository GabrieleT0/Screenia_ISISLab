require('dotenv').config();

const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


module.exports = async function verifyToken (req, res, next, roles = ["user", "editor", "admin"]){
    const token = req.cookies.token;
    

    if(!token){
        return res.status(401).send();
    }
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, authData)=>{
        if(err){
            return res.status(401).send();
        }

        if(!roles.includes(authData.role.name.toLowerCase())) {
            return res.status(403).send();
        }

        req.user = {...authData};

        next();
    })
}