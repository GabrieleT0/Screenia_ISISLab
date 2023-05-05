import { Op } from "sequelize";
import { tag as tagModel } from "../../models";

const getTagsByTitle = async (value = "") => {
    try {
        const tags = await tagModel.findAll({
            where: {
                title: {
                    [Op.like]: `%${value.trim()}%`
                }
            },
            order: [['title', 'DESC']],
            limit: 20
        });

        return tags;
    } catch(e) {
        throw new Error(e);
    }
}

const createTag = async (body = null) => {
    if(!body) throw new Error("Body is required!");

    try {
        const tagCreated = await tagModel.create({
          title: body.title.toLowerCase(),
          description: body.description,
          category: body.category,
          insert_date: new Date()
        });
  
        return tagCreated;
      } catch(e) {
        if(e.original && e.original.code && e.original.code === "ER_DUP_ENTRY") {
            throw new Error("Already existing tag!");
        }

        throw new Error(e);
    }

}

const TagService = {
    getTagsByTitle,
    createTag
}

export default TagService;