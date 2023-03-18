const express = require('express');
import initModels from "../../models/init-models";
import { config } from "../../utils/database/config";
import { database } from "../../utils/database/sequelizeDB";
const path = require('path');
const router = express.Router();
const knex = require('knex')(config);

/*router.get('/:idOpera/:idBook/:idChapter', async function (req, res) {
    const idOpera = req.params.idOpera;
    const idBook = req.params.idBook;
    const idChapter = req.params.idChapter;
  
    if(!idOpera) {
      return res.send(400, "Param idOpera is required!");
    }

    if(!idBook) {
        return res.send(400, "Param idBook is required!");
    }

    if(!idChapter) {
        return res.send(400, "Param idChapter is required!");
    }

    try {
        const result = await knex()
        .select('*')
        .from('paragraph')
        .where({ 
            id_opera: idOpera, 
            number_book: idBook,
            number_chapter: idChapter 
        });

        return res.send(result);
    } catch(e) {
        return res.status(500).send(e.message);
    }

})*/

router.get('/:idOpera/:idBook/:idChapter', async function (req, res) {
  const idOpera = req.params.idOpera;
  const idBook = req.params.idBook;
  const idChapter = req.params.idChapter;

  if(!idOpera) {
    return res.send(400, "Param idOpera is required!");
  }

  if(!idBook) {
      return res.send(400, "Param idBook is required!");
  }

  if(!idChapter) {
      return res.send(400, "Param idChapter is required!");
  }

  try {
    const Models = await initModels(database);;
    const Paragraph = Models.paragraph;
    
    const results = await Paragraph.findAll({
      where: {
        id_opera: idOpera,
        number_book: idBook,
        number_chapter: idChapter
      },
      order: [['number', 'ASC']]
    })

    return res.send(results);
  } catch(e) {
      return res.status(500).send(e.message);
  }

})

/*TO DO: da modificare con sequelize
router.get('/:idOpera/:idBook/:idChapter/:idParagraph', async function (req, res) {
  const idOpera = req.params.idOpera;
  const idBook = req.params.idBook;
  const idChapter = req.params.idChapter;
  const idParagraph = req.params.idParagraph;

  if(!idOpera) {
    return res.send(400, "Param idOpera is required!");
  }

  if(!idBook) {
    return res.send(400, "Param idBook is required!");
  }

  if(!idChapter) {
    return res.send(400, "Param idChapter is required!");
  }

  if(!idParagraph) {
    return res.send(400, "Param idParagraph is required!");
  }

  try {
    const result = await knex()
        .select('*')
        .from('paragraph')
        .where({ 
            id_opera: idOpera, 
            number_book: idBook,
            number_chapter: idChapter,
            number: idParagraph 
        });

    if(!result) {
        return res.status(202).send();
    }

    return res.send(result[0]);
  } catch(e) {
    return res.status(500).send(e.message);
  }

})*/

module.exports = router;
