require('dotenv').config();

const express = require('express');
import validateLogin from "../../middlware/validateLogin";
import validateRegister from "../../middlware/validateRegister";
import verifyToken from "../../middlware/verifyToken";
import initModels from "../../models/init-models";
const { Op } = require("sequelize");
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE;

router.get('/check_token', verifyToken, async function (req, res, next) {
    const user = {...req.user};

    const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role.name,
        other_info: user.other_info,
        is_approved: user.is_approved
    }

    return res.send(userData);
});

router.post('/login', validateLogin ,async function (req, res, next) {
    const { ...body } = req.body;

    try {
        const Models = await initModels(database);
        const User = Models.user;
        const Role = Models.role;

        const user = await User.findOne({
            where: {
                email: body.email
            },
            include: {
                model: Role,
                as: "role"
            }
        })

        if(!user) {
            return res.status(403).send({ message: "Invalid email or password!" });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!passwordIsValid) {
            return res.status(403).send({ message: "Invalid email or password!" });
        }

        if(!user.toJSON().is_approved) {
            return res.status(401).send({ message: "The account is being approved by an admin!" });
        }

        const accessToken = jwt.sign(
            user.toJSON(), ACCESS_TOKEN_SECRET, { expiresIn:  ACCESS_TOKEN_LIFE })

        //One minute for test: Date.now() + 1 * 60 * 1000
        res.cookie('token', accessToken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + (3600*3)*1000) });

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role.name,
            accessToken
        }
        
        return res.send(userData);
    } catch(e) {
        console.log('Error', e)
        return res.status(500).send(e.message);
    }
});

router.post('/sign-up', validateRegister, async function (req, res, next) {
    const body = { ...req.body};

    try {
        const Models = await initModels(database);
        const User = Models.user;
        const Role = Models.role;

        const userExistQuery = await User.findOne({
            where: {
                email: body.email
            }
        });

        if(userExistQuery) {
            return res.status(400).send({
                message: `A user with the following email ${body.email} is already registered!`
            });
        };

        const role = await Role.findOne({
            where: {
                name: "user"
            }
        })

        if(!role) {
            throw new Error("User role not existing in the database!");
        }

        const passwordHash = await bcrypt.hash(body.password, 8);

        await User.create({
            email: body.email,
            name: body.name,
            surname: body.surname,
            password: passwordHash,
            registered_date: new Date(),
            other_info: body.otherInfo,
            role_id: role.toJSON().id
        });

        res.status(200).send({ message: "User registered successfully!" });
    } catch(e) {
        res.status(500).send({
            error: e,
            message: e.message
        });
    }
  
})

router.post('/logout', async function (req, res, next) {
   //const body = { ...req.body};
    const token = req.cookies.token;

    try {
        jwt.sign(token, "", { expiresIn: 1 } , (logout, err) => {
            if (logout) {
                res.clearCookie("token");
                res.status(200).send({ message: 'You have been Logged Out' });
            } else {
                res.status(500).send({ message: err });
            }
        });
        
        res.status(200).send();
    } catch(e) {
        res.status(500).send({
            error: e,
            message: e.message
        });
    }
  
})

module.exports = router;