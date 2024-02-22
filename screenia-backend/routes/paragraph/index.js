const express = require('express');
import { paragraph } from "../../models";
const path = require('path');
const router = express.Router();

router.get('/:idOpera/:idBook/:idChapter', async function (req, res) {
  const idOpera = req.params.idOpera;
  const idBook = req.params.idBook;
  const idChapter = req.params.idChapter;

  if (!idOpera) {
    return res.send(400, "Param idOpera is required!");
  }

  if (!idBook) {
    return res.send(400, "Param idBook is required!");
  }

  if (!idChapter) {
    return res.send(400, "Param idChapter is required!");
  }

  try {
    const Paragraph = paragraph;

    const results = await Paragraph.findAll({
      where: {
        id_opera: idOpera,
        number_book: idBook,
        number_chapter: idChapter
      },
      order: [['number', 'ASC']]
    })

    return res.send(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }

})

router.get('/:idOpera/:idBook/:idChapter/:idParagraph', async function (req, res) {
  const idOpera = req.params.idOpera;
  const idBook = req.params.idBook;
  const idChapter = req.params.idChapter;
  const idParagraph = req.params.idParagraph;

  if (!idOpera) {
    return res.send(400, "Param idOpera is required!");
  }

  if (!idBook) {
    return res.send(400, "Param idBook is required!");
  }

  if (!idChapter) {
    return res.send(400, "Param idChapter is required!");
  }

  if (!idParagraph) {
    return res.send(400, "Param idParagraph is required!");
  }

  try {
    const Paragraph = paragraph;

    const results = await Paragraph.findAll({
      where: {
        id_opera: idOpera,
        number_book: idBook,
        number_chapter: idChapter,
        number_paragraph: idParagraph,
      },
      order: [['number', 'ASC']]
    })

    return res.send(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }

})

module.exports = router;
