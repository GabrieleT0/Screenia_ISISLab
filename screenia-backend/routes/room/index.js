const express = require('express');
import { Op, Sequelize } from "sequelize";
import verifyToken from "../../middlware/verifyToken";
import initModels from "../../models/init-models";
import user from "../../models/user";
import RoomService from "../../services/room";
import { config } from "../../utils/database/config";
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();
const knex = require('knex')(config);

router.get('/:idRoom', 
  (req, res, next) => verifyToken(req, res, next, ["user", "editor", "admin"]), 
  async function (req, res) {
    const idRoom = req.params.idRoom;
    
    if(!idRoom) {
        return res.status(400).send("Param idRoom is required!");
    }

    try {
      const room = await RoomService.findRoomId(idRoom);
      
      res.status(200).send(room);
    } catch(e) {
      

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
})

router.post('/', 
  (req, res, next) => verifyToken(req, res, next, ["editor", "admin"]),
  async function (req, res) {
    const body = { ...req.body};

    if(!body.comment_paragraph_id) {
      return res.status(400).send("Param comment_paragraph_id is required!");
  }

    try {
      await RoomService.createRoom({ ...body }, req.user);

      res.status(200).send();
    } catch(e) {
      

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

module.exports = router;
