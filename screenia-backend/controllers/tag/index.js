import TagService from "../../services/tag";

const searchTags = async (req, res) => {
    try {
        const resultQuery = await TagService.getTags();

        return res.send(resultQuery || []);
    } catch(e) {
        return res.status(500).send(e.message);
    }
}

const insertTag = async (req, res) => {
    const body = { ...req.body};

    if(!body.title) {
      return res.send(400, "Param title is required!");
    }

    if(!body.category) {
      return res.send(400, "Param category is required!");
    }

    try {
      await TagService.createTag({ ...body });

      res.status(200).send();
    } catch(e) {
      res.status(500).send({
        error: e,
        message: e.message
      });
    }
  
}

export {
  searchTags,
  insertTag
};
