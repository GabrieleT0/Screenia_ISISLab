require('dotenv').config();

const express = require('express');
import verifyToken from "../../middlware/verifyToken";
import initModels from "../../models/init-models";
const { Op } = require("sequelize");
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();

router.get(
    '/usersToApprove',
    //(req, res, next) => verifyToken(req, res, next, ["admin"]),
    async function (req, res, next) {
        const idUser = req.params.idUser
    
        try {
           const Models = await initModels(database);
           const User = Models.user;
   
           const users = await User.findAll({
                where: { is_approved: false },
                order: [['registered_date', 'DESC']],
            });
   
           res.send(users);
        } catch(e) {
           res.status(500).send({
               error: e,
               message: e.message
           });
        }   
   }
)

router.post(
    '/approval', 
    //(req, res, next) => verifyToken(req, res, next, ["admin"]), 
    async function (req, res, next) {
     const idUsers = req.body.idUsers;

     if(!idUsers) {
        return res.status(400).send("Param idUsers is required!");
     }

     if(!Array.isArray(idUsers) || !idUsers.every((id) => Number.isInteger(id))) {
        return res.status(400).send("Param idUsers must be an array of integers");
     }
 
     try {
        const Models = await initModels(database);
        const User = Models.user;

        const updateUser = await User.update(
            {
              is_approved: true,
            },
            {
              where: { id: [...idUsers] },
            }
        );

        if(updateUser[0] === 0) {
            res.status(404).send("Users not found or accounts already approved!")
        }

        res.send();
     } catch(e) {
        res.status(500).send({
            error: e,
            message: e.message
        });
     }
})

module.exports = router;