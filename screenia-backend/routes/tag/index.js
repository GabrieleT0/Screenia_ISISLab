const express = require('express');
import initModels from "../../models/init-models";
const { Op } = require("sequelize");
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();

router.get('/search', async function (req, res) {
    const { value = "" } = req.query;

    try {
        const Models = await initModels(database);;
        const Tag = Models.tag;

        const resultQuery = await Tag.findAll({
            where: {
                title: {
                    [Op.like]: `%${value.trim()}%`
                }
            }
        });

        return res.send(resultQuery || []);
    } catch(e) {
        return res.status(500).send(e.message);
    }
});

router.post('/', async function (req, res) {
    const body = { ...req.body};

    if(!body.title) {
      return res.send(400, "Param title is required!");
    }

    if(!body.category) {
      return res.send(400, "Param category is required!");
    }

    try {
      const Models = await initModels(database);;
      const Tag = Models.tag;

      let tag = await Tag.create({
        title: body.title.toLowerCase(),
        description: body.description,
        category: body.category,
        insert_date: new Date()
      });

      res.status(200).send(tag);
    } catch(e) {
      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

module.exports = router;