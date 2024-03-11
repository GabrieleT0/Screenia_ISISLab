require('dotenv').config();

const express = require('express');
import { approveUsers, getAllUserEditor, getAllUsersToApprove } from "../../controllers/user";
import verifyToken from "../../middlware/verifyToken";
const router = express.Router();

router.get(
   '/usersToApprove',
   (req, res, next) => verifyToken(req, res, next, ["admin"]),
   getAllUsersToApprove
)

router.get(
   '/usersEditors',
   getAllUserEditor
)

router.post(
   '/approval',
   (req, res, next) => verifyToken(req, res, next, ["admin"]),
   approveUsers
)

module.exports = router;