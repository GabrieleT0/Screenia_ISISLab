const express = require('express');
const router = express.Router();
import { getBookByOpera, getBooksByOpera } from "../../controllers/book";

router.get('/:idOpera', getBooksByOpera)

router.get('/:idOpera/:idBook', getBookByOpera)

module.exports = router;
