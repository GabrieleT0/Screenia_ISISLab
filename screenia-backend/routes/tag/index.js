const express = require('express');
import { insertTag, searchTagsByTitle } from "../../controllers/tag";
import initModels from "../../models/init-models";
const { Op } = require("sequelize");
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();
import verifyToken from "../../middlware/verifyToken";

router.get(
  '/search',
  (req, res, next) => verifyToken(req, res, next, ["admin"]),
  searchTagsByTitle
);

router.post(
  '/',
  (req, res, next) => verifyToken(req, res, next, ["admin"]),
  insertTag
)

module.exports = router;