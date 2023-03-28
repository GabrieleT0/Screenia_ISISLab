const express = require('express');
import verifyToken from "../../middlware/verifyToken";
import DiscussionService from "../../services/discussion";
const router = express.Router();

router.get('/room/:idRoom', 
  async function (req, res) {
    const idRoom = req.params.idRoom;
    
    if(!idRoom) {
        return res.status(400).send("Param idRoom is required!");
    }

    try {
      const discussions = await DiscussionService.getDiscussionsByRoom(idRoom);
      
      res.status(200).send(discussions);
    } catch(e) {
      console.log('Error: ', e);

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

    if(!body.text) {
        return res.status(400).send("Param text is required!");
    }

    if(!body.flat_text) {
        return res.status(400).send("Param flatText is required!");
    }

    if(!body.room_id) {
        return res.status(400).send("Param idRoom is required!");
    }

    try {
      await DiscussionService.createDiscussion({
        insert_date: new Date(),
        text: body.text,
        flat_text: body.flat_text,
        user_id: req.user.id,
        room_id: body.room_id
      });

      res.status(200).send();
    } catch(e) {
      console.log('Error: ', e);

      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
})

module.exports = router;
