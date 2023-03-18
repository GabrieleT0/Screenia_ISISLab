import { 
    discussion,
    user
} from "../../models";

const createDiscussion = async (body) => {
    try {
        const data = await discussion.create({
            insert_date: new Date(),
            text: body.text,
            flat_text: body.flat_text,
            user_id: body.user_id,
            room_id: body.room_id
        });

        return data;
    } catch(error) {
        throw new Error(error.message)
    }
}

const getDiscussionsByRoom = async (idRoom) => {
    try {
        const data = await discussion.findAll({
            where: {
                room_id: idRoom
            },
            order: [['insert_date', 'DESC']],
            include: [
                {
                    model: user,
                    attributes: ["id", "name", "surname"]
                }
            ]
        });

        return data;
    } catch(error) {
        throw new Error(error.message)
    }
}

const DiscussionService = {
    createDiscussion,
    getDiscussionsByRoom
}

export default DiscussionService;