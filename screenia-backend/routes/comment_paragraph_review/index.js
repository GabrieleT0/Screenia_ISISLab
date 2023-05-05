const express = require('express');
import { Op, Sequelize } from "sequelize";
import verifyToken from "../../middlware/verifyToken";
import { comment_paragraph, comment_paragraph_review, tag, db } from "../../models";
import initModels from "../../models/init-models";
import user from "../../models/user";
import { config } from "../../utils/database/config";
const router = express.Router();
const knex = require('knex')(config);

router.get('/:idComment', 
  (req, res, next) => verifyToken(req, res, next, ["user", "editor", "admin"]), 
  async function (req, res) {
    try {
      const idComment = req.params.idComment;
      const Models = await initModels(database);
      const CommentReview = Models.comment_paragraph_review;

      const comments = await CommentReview.findAll({
        where: {
          id_parent_comment: idComment
        }
      });
      
      res.status(200).send(comments);
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

    if(!body.idCurrentComment) {
      return res.send(400, "Param idCurrentComment is required!");
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

    if(!body.tagUpdate) {
      return res.send(400, "Param tagUpdate is required!");
    }

    if(!["major", "minor"].includes(body.tagUpdate.toLowerCase())) {
      return res.send(400, "Param tagUpdate can be minor or major!");
    }

    let transaction = null;
    try {
      transaction = await db.transaction();

      const Comment = comment_paragraph;
      const CommentReview = comment_paragraph_review;
      const Tag = tag;

      //Existing Comment
      const comment = await Comment.findByPk(body.idCurrentComment, {
        include: [{ model: Tag }]
      });

      if(!comment) {
        return res.send(400, "Comment not existing!");
      }

      //Existing Tag if present
      if(body.tags.length > 0) {
        const tagsDB = await Tag.findAll({
          where: {
            title: [...body.tags]
          },
          raw: true
        })

        let checkTag = true;
        for(const tag of body.tags) {
          checkTag = tagsDB.map(tagDB => tagDB.title).includes(tag);
          if(!checkTag) {
            break;
          }
        }

        if(!tagsDB || tagsDB.length === 0 || !checkTag) {
          return res.send(400, "Some of the specified tags do not exist!");
        }
      }

      let commentReview = await CommentReview.create({
        text: body.text,
        flatText: body.flatText,
        update_date: new Date(),
        from_paragraph: body.from ? body.from : 0,
        to_paragraph: body.to ? body.to : 0,
        flat_text: body.flatText,
        tag_update: body.tagUpdate.toLowerCase(),
        tags: body.tags.length > 0 ? body.tags : null,
        id_parent_comment: comment.id
      }, { transaction: transaction });

      //Update Comment in Current Comment Table
      await Comment.update({
        text: body.text,
        insert_date: new Date(),
        from_paragraph: body.from ? body.from : 0,
        to_paragraph: body.to ? body.to : 0,
        flat_text: body.flatText
      }, { 
        where: { 
          id: comment.id
        },
        transaction: transaction
      });

      //Delete Tag
      const newTags = [...body.tags];
      const existingTags = comment.dataValues.tags.map((tag) => tag.title);
      const tagsToRemove = existingTags.filter(tag => !newTags.includes(tag));
      for(const tag of tagsToRemove) {
        await comment.removeTag(tag, { transaction: transaction });
      }

      //Create Tag
      const tagsToCreate = newTags.filter(tag => !existingTags.includes(tag));
      for(const tag of tagsToCreate) {
        await comment.addTag(tag, { transaction: transaction });
      }
  
      await transaction.commit();

      res.status(200).send(commentReview);
    } catch(e) {
      

      if(transaction) await transaction.rollback();

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

module.exports = router;
