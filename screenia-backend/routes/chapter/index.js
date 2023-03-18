const express = require('express');
import { getAllChapter } from "../../controllers/chapter";
const router = express.Router();

router.get('/:idOpera/:idBook', getAllChapter)

module.exports = router;
