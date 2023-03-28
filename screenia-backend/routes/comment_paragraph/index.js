const express = require('express');
import { Op, Sequelize } from "sequelize";
import verifyToken from "../../middlware/verifyToken";
import { comment_paragraph, comment_paragraph_review, tag, user } from "../../models";
import CommentParagraphService from "../../services/comment_paragraph";
import RoomService from "../../services/room";
import { config } from "../../utils/database/config";
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();

router.post('/', 
  (req, res, next) => verifyToken(req, res, next, ["editor", "admin"]),
  async function (req, res) {
    const body = { ...req.body};
    const user = { ...req.user};

    if(!body.idOpera) {
      return res.send(400, "Param idOpera is required!");
    }

    if(!body.idBook) {
      return res.send(400, "Param idBook is required!");
    }

    if(!body.idChapter) {
      return res.send(400, "Param idChapter is required!");
    }

    if(!body.idParagraph) {
      return res.send(400, "Param idParagraph is required!");
    }

    if(!body.text) {
      return res.send(400, "Param text is required!");
    }

    if(!body.flatText) {
      return res.send(400, "Param flatText is required!");
    }

    if(!body.tags) {
      return res.send(400, "Param tags is required!");
    }

    if(body.tags && !Array.isArray(body.tags)) {
      return res.send(400, "Param tags is it must be array!");
    }

    if(!body.tags.every(i => typeof i === "string")) {
      return res.send(400, "Param tags it can only contain strings");
    }

    if(!body.from) {
      return res.send(400, "Param from is required!");
    }

    if(!body.to) {
      return res.send(400, "Param to is required!");
    }

    if(body.idParent && !body.impact) {
      return res.send(400, "Param impact is required!");
    }

    try {
      if(body.idParent) {
        //Controllo se l'utente che aveva creato il commento è colui che sta effettuando la modifica
        const commentFind = await CommentParagraphService.findByIdComment(body.idParent);
        if(commentFind.user_id !== user.id) {
            return res.send(401, "The user is not allowed to edit the comment!");
        }
      }
      
      await CommentParagraphService.createComment({ ...body }, user);

      res.status(200).send();
    } catch(e) {
      console.log('Error: ', e);

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

router.post('/:idOpera/:idBook/:idChapter', 
  async function (req, res) {
    const params = {...req.params}
    const username = req.body.username;
    const tags = req.body.tags;

    try {
      const data = await CommentParagraphService.findAllComment({...params}, username, [...tags]);

      const comments = [];

      for(const comment of data) {
        
      }

      res.status(200).send(data);
    } catch(e) {
      console.log('Error: ', e);

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

router.get('/room/:idRoom', 
  async function (req, res) {
    const params = {...req.params}

    if(!params.idRoom) {
      return res.status(400).send("Param idRoom is required!");
    }

    try {
      const room = await RoomService.findRoomId(params.idRoom);
      const comment = await CommentParagraphService.getCommentsRevisionById(room.comment_paragraph_id);

      const results = [];
      const commentCopy = {...comment};
      delete commentCopy.revisions;
      const commentsRevision = comment.revisions.map(comment => comment);
      results.push(commentCopy)
      results.push(...commentsRevision);
      

      res.status(200).send(results);
    } catch(e) {
      console.log('Error: ', e);

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

module.exports = router;
