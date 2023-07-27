const express = require('express');
import { insertTag, searchTags } from "../../controllers/tag";
import verifyToken from "../../middlware/verifyToken";
const { Op } = require("sequelize");
const router = express.Router();

router.get(
  '/search',
  searchTags
);

router.post(
  '/',
  (req, res, next) => verifyToken(req, res, next, ["admin"]),
  insertTag
)

module.exports = router;