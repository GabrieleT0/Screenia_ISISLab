const express = require('express');
import { Op, Sequelize } from "sequelize";
import verifyToken from "../../middlware/verifyToken";
import { comment_paragraph, comment_paragraph_review, tag, user } from "../../models";
import CommentParagraphService from "../../services/comment_paragraph";
import RoomService from "../../services/room";
import { config } from "../../utils/database/config";
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();
const knex = require('knex')(config);

/*router.post('/:idOpera/:idBook/:idChapter', 
  (req, res, next) => verifyToken(req, res, next, ["user", "editor", "admin"]), 
  async function (req, res) {
    const idOpera = req.params.idOpera;
    const idBook = req.params.idBook;
    const idChapter = req.params.idChapter;
    const { limit } = req.query;
    const filter = req.body.filter;
  
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
      const Comment = comment_paragraph;
      const Tag = tag;
      const User = user;
      const CommentReview = comment_paragraph_review;

      let comments = [];

      if(filter && (filter.user || filter.tags)) {
        const user = filter.user;
        const tags = filter.tags;
        let whereUser = null;
        let whereTags = null;
        const requiredUserAndtags = user && tags && Array.isArray(tags) && tags.length > 0;

        if(user) {
          whereUser = {
            [Op.or]: [
                Sequelize.where(
                    Sequelize.fn('concat', Sequelize.col('name'), ' ', Sequelize.col('surname')), {
                        [Op.like]: `%${filter.user}%`,
                    },
                )
            ],
          }
        }

        if(tags && Array.isArray(tags) && tags.length > 0) {
          whereTags = {
            title: filter.tags
          }
        }

        comments = await Comment.findAll({
          where: { 
            id_opera: idOpera,
            number_book: idBook,
            number_chapter: idChapter,
          },
          //limit: limit && parseInt(limit) > 0 ? parseInt(limit) : null,
          order: [['insert_date', 'DESC']],
          include: [
            { 
              model: Tag,
              required: false,
              where: whereTags,
              required: requiredUserAndtags,
            }, 
            { 
              model: User,
              where: whereUser,
              required: requiredUserAndtags,
            },
            {
              model: CommentReview,
              required: false,
              //attributes: [[Sequelize.fn('COUNT', 'id'), 'count']]
            }]
        })
      } else {
        comments = await Comment.findAll({
          where: { 
            id_opera: idOpera,
            number_book: idBook,
            number_chapter: idChapter,
          },
          //limit: limit && parseInt(limit) > 0 ? parseInt(limit) : null,
          order: [['insert_date', 'DESC']],
          include: [
            { model: Tag, required: false }, 
            { model: User, attributes: ['id', 'email', 'name', 'surname'] },
            {
              model: CommentReview,
              required: false,
              //attributes: [[Sequelize.fn('COUNT', 'id'), 'count']]
            }
          ]
        })
      }

      //Create reference comment for view
      for(const comment of comments) {
        if(comment.from_paragraph !== comment.to_paragraph) {
          for(let i=0; i < comment.to_paragraph - 1; i++) {
            const jsonMultipleComment = getJsonRichTextReferenceToMultipleComment({ 
              id: `${comment.id_opera}, ${comment.number_book}, ${comment.number_chapter}, ${comment.number_paragraph}`,
              name: `${req.user.name} ${req.user.surname}, paragrafo ${comment.number_paragraph}`,
              link: `${comment.id_opera}, ${comment.number_book}, ${comment.number_chapter}, ${comment.number_paragraph}`
            });
  
            comments.push({
              id_opera: comment.id_opera,
              number_book: comment.number_book,
              number_chapter: comment.number_chapter,
              number_paragraph: comment.number_paragraph,
              text: JSON.stringify(jsonMultipleComment),
              from_paragraph: 0,
              to_paragraph: 0,
              number_paragraph: i+1,
              reference_to_comment: comment.id,
              insert_date: comment.insert_date,
              tags: [...comment.tags],
              user: {...comment.user.dataValues}
            })
          }
        }
      }

      const results = {
        comments: [...comments]
      };

      return res.send(results);
    } catch(e) {
      console.log('error', e)
        return res.status(500).send(e.message);
    }

})*/

/*router.post('/', 
  (req, res, next) => verifyToken(req, res, next, ["editor", "admin"]),
  async function (req, res) {
    const body = { ...req.body};

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

    try {
      const transaction = await database.transaction();
      const Comment = comment_paragraph;
      const Tag = tag;

      let comment = await Comment.create({
        text: body.text,
        id_opera: body.idOpera,
        number_book: body.idBook,
        number_chapter: body.idChapter,
        number_paragraph: body.idParagraph,
        insert_date: new Date(),
        user_id: req.user.id,
        from_paragraph: body.from ? body.from : 0,
        to_paragraph: body.to ? body.to : 0,
        flat_text: body.flatText
      }, { transaction: transaction });

      const tags = body.tags;
      const tagsDB = [];

      if(tags.length > 0) {
        for(const tagItem of tags) {
          const tagDB = await Tag.findByPk(`${tagItem}`);

          if(!tagDB) {
            await transaction.rollback();
            throw new Error(`Tag ${tagItem} not found!`);
          }
          tagsDB.push(tagDB);
        }

        await comment.addTag(tagsDB, { transaction: transaction });
      }
  
      await transaction.commit();

      res.status(200).send();
    } catch(e) {
      console.log('Error: ', e);

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})*/

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

const getJsonRichTextReferenceToMultipleComment = (mention = null) => {  
  if(!mention || !mention.id || !mention.name || !mention.link) return null;

  const text = `Riferisciti al commento di ${mention.name}`;
  return {
    "blocks":[
       {
          "text": `Riferisciti al commento di ${mention.name}`,
          "type":"unstyled",
          "depth":0,
          "inlineStyleRanges":[
             
          ],
          "entityRanges":[
             {
                "offset": text.substring(0, 27).length,
                "length": text.substring(0, 27).length + mention.name.length,
                "key":0
             }
          ],
          "data":{
             
          }
       }
    ],
    "entityMap":{
       "0":{
          "type":"/comment_multiple_referencemention",
          "mutability":"IMMUTABLE",
          "data":{
             "mention":{
                "id": mention.id,
                "name": mention.name,
                "link": mention.link,
                "type":"comment_multiple_reference"
             }
          }
       }
    }
 }
}

module.exports = router;
