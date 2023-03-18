import { room } from "../../models"

const createRoom = async (body = {}, user = {}) => {
    try {
        const data = await room.create({
            created_date: new Date(),
            comment_paragraph_id: body.comment_paragraph_id,
            user_id: user.id
        });

        return data;
    } catch(error) {
        throw new Error(error.message)
    }
}

const existingRoomByIdComment = async (idComment) => {
    try {
        const count = await room.count({
            where: {
              comment_paragraph_id: idComment
            }
        });

        return count === 0 ? false : true;
    } catch(error) {
        throw new Error(error.message)
    }
}

const findRoomId = async (id) => {
    try {
        const data = await room.findByPk(id, { raw: true });

        return data;
    } catch(error) {
        throw new Error(error.message)
    }
}

const RoomService = {
    createRoom,
    existingRoomByIdComment,
    findRoomId
}

export default RoomService;