require('dotenv').config();

const express = require('express');
import verifyToken from "../../middlware/verifyToken";
import initModels from "../../models/init-models";
const { Op } = require("sequelize");
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();
import { getAllUsersToApprove, approveUsers } from "../../controllers/user";

router.get(
   '/usersToApprove',
   (req, res, next) => verifyToken(req, res, next, ["admin"]),
   getAllUsersToApprove
)

router.post(
   '/approval', 
   (req, res, next) => verifyToken(req, res, next, ["admin"]),
   approveUsers 
)

module.exports = router;