import { Op, Sequelize } from "sequelize";
import { comment_paragraph, db, room, tag, user } from "../../models";
import RoomService from "../room";

const findByIdComment = async (id) => {
    try {
        const data = await comment_paragraph.findByPk(id, {
            include: [{ model: tag }],
            raw: true
        });

        return data;
    } catch(error) {
        throw new Error(error.message)
    }
}

/**
 * Recupera tutti i commenti (con eventuali filtri) 
 * e per ogni commento recupera solo la revisione più recente, se esiste
 * e sostituisce i dati della revisione al commento
**/
const findAllComment = async (conditions, username, tags) => {
    try {
        const comments = await comment_paragraph.findAll({
            where: {
                id_opera: conditions.idOpera,
                number_book: conditions.idBook,
                number_chapter: conditions.idChapter,
                parent_id: null
            },
            include: [
                { 
                    model: tag, 
                    required: false,
                },
                {
                    model: user,
                    required: true,
                    attributes: ["id", "name", "surname"],
                    where: {
                        [Op.or]: [
                            Sequelize.where(
                                Sequelize.fn('concat', Sequelize.col('name'), ' ', Sequelize.col('surname')), {
                                    [Op.like]: `%${username}%`,
                                },
                            )
                        ],
                    }
                },
                {
                    model: comment_paragraph,
                    as: 'revisions',
                    required: false,
                    where: {
                        insert_date: {
                        [Op.eq]: Sequelize.literal(`(SELECT MAX(insert_date) FROM comment_paragraph AS revisions WHERE revisions.parent_id = comment_paragraph.id)`)
                      }
                    },
                    include: [
                        { 
                            model: tag
                        }
                    ]
                },
                { 
                    model: room, 
                    required: false,
                }
            ]
        });

        //Aggiorno i dati del commento con i dati dell'ultima revisione
        const newComments = comments.map(comment => {
            //Ottengo il commento come JSON senza wrapper Sequelize
            const commentJson = comment.get({ plain: true });

            if(commentJson.revisions[0]) {
                let newComment = {
                    ...commentJson,
                    ...commentJson.revisions[0]
                }
                delete newComment.revisions;

                return newComment;
            }

            return commentJson;
        });

        //Filtro i commenti per tag
        const result = newComments.filter(comment => {
            return tags.every(tagTitle => {
              return comment.tags.some(tag => tag.title === tagTitle);
            });
        });

        return result;
    } catch(error) {
        
        throw new Error(error.message)
    }
}

const createComment = async (body, user = null) => {
    const transaction = await db.sequelize.transaction();

    try {
        if(body.idParent) {
            //Se non è stata creata la stanza, alla prima modifica di un commento viene creata
            const isExistRoom = await RoomService.existingRoomByIdComment(body.idParent);
            
            if(!isExistRoom) {
                await RoomService.createRoom(
                    { comment_paragraph_id: body.idParent }, user);
            }
        }

        //Creazione del commento
        const comment = await comment_paragraph.create({
            text: body.text,
            id_opera: body.idOpera,
            number_book: body.idBook,
            number_chapter: body.idChapter,
            number_paragraph: body.idParagraph,
            insert_date: new Date(),
            user_id: user.id,
            from_paragraph: body.from,
            to_paragraph: body.to,
            flat_text: body.flatText,
            parent_id: body.idParent || null,
            impact: body.impact || null
        }, { transaction: transaction })

        const tags = body.tags;
        const tagsDB = [];

        // Associazione dei tag al commento
        if(tags.length > 0) {
            for(const tagItem of tags) {
                const tagDB = await tag.findByPk(`${tagItem}`);

                if(!tagDB) {
                    await transaction.rollback();
                    throw new Error(`Tag ${tagItem} not found!`);
                }
                tagsDB.push(tagDB);
            }

            await comment.addTag(tagsDB, { transaction: transaction });
        }

        await transaction.commit();

        return comment;
    } catch(error) {
        await transaction.rollback();
        throw new Error(error.message)
    }
}

const getCommentsRevisionById = async (idComment) => {
    try {
        const comment = await comment_paragraph.findOne({
            where: {
                id: idComment
            },
            include: [
                {
                    model: comment_paragraph,
                    as: 'revisions',
                    include: [
                        { 
                            model: tag
                        },
                        {
                            model: user,
                            attributes: ["id", "name", "surname"]
                        }
                    ]
                },
                {
                    model: tag
                },
                {
                    model: user,
                    attributes: ["id", "name", "surname"]
                }
            ]
        })

        return comment.get({ plain: true });
    } catch(error) {
        
        throw new Error(error.message)
    }
}

const CommentParagraphService = {
    findByIdComment,
    findAllComment,
    createComment,
    getCommentsRevisionById
}

export default CommentParagraphService;