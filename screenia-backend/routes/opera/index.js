const express = require('express');
const router = express.Router();
import { getAllOpera, getOperaById, saveAllOpera } from "../../controllers/opera/index";

router.get('/', getAllOpera);

router.get('/:id', getOperaById);

router.get('/uploadAllOpera', saveAllOpera);

module.exports = router;
