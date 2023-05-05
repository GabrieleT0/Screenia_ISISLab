const express = require('express');
import { getCommentRichText, getInRichText, getOutRichText } from "../../controllers/rich_text";
import initModels from "../../models/init-models";
const { Op, Sequelize } = require("sequelize");
import { database } from "../../utils/database/sequelizeDB";
const router = express.Router();

/*router.get('/out', async function (req, res) {
    const { idOpera, value = "" } = req.query;

    if(!idOpera) {
        return res.send([]);
    }

    if(value.trim().length === 0) {
        return res.send([]);
    }

    const searchSplit = value.split(",");

    try {
        const Opera = Models.opera_primary_literature;
        const Author = Models.author_primary_literature;
        const Book = Models.book;
        const Chapter = Models.chapter;
        const Paragraph = Models.paragraph;

        const resultQuery = await Author.findAll({
            attributes: ['id', 'name'],
            where: {
                name: {
                    [Op.like]: `%${searchSplit[0].trim()}%`
                }
            },
            include: [
                {
                    model: Opera, 
                    as: 'opera_authors',
                    attributes: ['id', 'title'],
                    where: {
                        [Op.not]: [
                            { id: idOpera }
                        ],
                        title: {
                            [Op.like]: searchSplit[1] ? `%${searchSplit[1].trim()}%` : `%%`
                        }
                    },
                    include: {
                        model: Book,
                        as: 'books',
                        attributes: ['number', 'title'],
                        where: {
                            number: {
                                [Op.like]: searchSplit[2] ? `%${searchSplit[2].trim()}%` : `%%`
                            }
                        },
                        include: {
                            model: Chapter,
                            as: 'chapters',
                            attributes: ['number'],
                            where: {
                                number: {
                                    [Op.like]: searchSplit[3] ? `%${searchSplit[3].trim()}%` : `%%`
                                }
                            }
                        }
                    }
                }
            ]
        });

        const result = [];
        for(const author of resultQuery) {
            let value = "";
            if(author && author.id) {

                if(author.opera_authors) {
                    for(const opera of author.opera_authors) {
                        value = `${author.name}, ${opera.title}`;
                        result.push({
                            id: `${author.id}, ${opera.id}`,
                            name: value,
                            link: `${opera.id}`
                        })

                        const books = opera.books;
                        if(books) {
                            for(const book of books) {
                                value = `${author.name}, ${opera.title}, ${book.number}`
                                result.push({
                                    id: `${author.id}, ${opera.id}, ${book.number}`,
                                    name: value,
                                    link: `${opera.id}/${book.number}`
                                })

                                const chapters = book.chapters;
                                if(chapters) {
                                    for(const chapter of chapters) {
                                        value = `${author.name}, ${opera.title}, ${book.number}, ${chapter.number}`;
                                        result.push({
                                            id: `${author.id}, ${opera.id}, ${book.number}, ${chapter.number}`,
                                            name: value,
                                            link: `${opera.id}/${book.number}/${chapter.number}`
                                        })

                                        const paragraphs = await Paragraph.findAll({
                                            attributes: ['number'],
                                            where: {
                                                number: {
                                                    [Op.like]: searchSplit[4] ? `%${searchSplit[4].trim()}%` : `%%`
                                                },
                                                id_opera: opera.id,
                                                number_book: book.number,
                                                number_chapter: chapter.number
                                            }
                                        });


                                        if(paragraphs) {
                                            for(const paragraph of paragraphs) {
                                                value = `${author.name}, ${opera.title}, ${book.number}, ${chapter.number}, ${paragraph.number}`;
                                                result.push({
                                                    id: `${author.id}, ${opera.id}, ${book.number}, ${chapter.number}, ${paragraph.number}`,
                                                    name: value,
                                                    link: `${opera.id}/${book.number}/${chapter.number}`
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //Return the first 5 results for performance reasons
        const resultFiltered = result.sort().slice(0, 5);

        return res.send(resultFiltered || []);
    } catch(e) {
        return res.status(500).send(e.message);
    }
});

router.get('/in', async function (req, res) {
    const { idOpera, value = "" } = req.query;

    if(!idOpera) {
        return res.send([]);
    }

    if(value.trim().length === 0) {
        return res.send([]);
    }

    const searchSplit = value.split(",");

    try {
        const Models = await await initModels(database);;
        const Opera = Models.opera_primary_literature;
        const Book = Models.book;
        const Chapter = Models.chapter;
        const Paragraph = Models.paragraph;

        const resultQuery = await Opera.findOne({
            attributes: ['id', 'title'],
            where: {
                id: idOpera
            },
            include: [
                {
                    model: Book,
                    as: 'books',
                    attributes: ['number', 'title'],
                    where: {
                        number: {
                            [Op.like]: `%${searchSplit[0].trim()}%`
                        }
                    },
                    include: {
                        model: Chapter,
                        as: 'chapters',
                        attributes: ['number'],
                        where: {
                            number: {
                                [Op.like]: searchSplit[1] ? `%${searchSplit[1].trim()}%` : `%%`
                            }
                        }
                    }
                }
            ]
        });

        if(!resultQuery) {
            return res.send([]);
        }

        const opera = resultQuery.toJSON();

        const result = [];
        let name = "";
        if(opera && opera.id) {
            const books = opera.books;

            if(books) {
                for(const book of books) {
                    name = `${book.number}`
                    result.push({
                        id: `${opera.id}, ${name}`,
                        name: name,
                        link: `${opera.id}/${book.number}`,
                    })

                    const chapters = book.chapters;
                    if(chapters) {
                        for await (const chapter of chapters) {
                            name = `${book.number}, ${chapter.number}`;
                            result.push({
                                id: `${opera.id}, ${name}`,
                                name: name,
                                link: `${opera.id}/${book.number}/${chapter.number}`,
                            })

                            const paragraphs = await Paragraph.findAll({
                                attributes: ['number'],
                                where: {
                                    number: {
                                        [Op.like]: searchSplit[2] ? `%${searchSplit[2].trim()}%` : `%%`
                                    },
                                    id_opera: opera.id,
                                    number_book: book.number,
                                    number_chapter: chapter.number
                                }
                            });

                            if(paragraphs) {
                                for(const paragraph of paragraphs) {
                                    name = `${book.number}, ${chapter.number}, ${paragraph.number}`
                                    result.push({
                                        id: `${opera.id}, ${name}`,
                                        name: name,
                                        link: `${opera.id}/${book.number}/${chapter.number}/${paragraph.number}`,
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }

        //Return the first 5 results for performance reasons
        const resultFiltered = result.sort().slice(0, 5);

        return res.send(resultFiltered || []);
    } catch(e) {
        return res.status(500).send(e.message);
    }
});

router.get('/comment', async function (req, res) {
    const { idOpera, value = "" } = req.query;

    if(!idOpera) {
        return res.send([]);
    }

    if(value.trim().length === 0) {
        return res.send([]);
    }

    const searchSplit = value.split(",");

    try {
        const Models = await initModels(database);;
        const User = Models.user;
        const Comment = Models.comment_paragraph;
        const userQuery = await User.findOne({
            attributes: ["id", "name", "surname"],
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn('concat', Sequelize.col('name'), ' ', Sequelize.col('surname')), {
                            [Op.like]: `%${searchSplit[0].trim()}%`,
                        },
                    )
                ],
            },
            include: {
                model: Comment,
                attributes: ['id', 'id_opera', 'number_book', 'number_chapter', 'number_paragraph'],
                where: {
                    id_opera: idOpera,
                    number_book: {
                        [Op.like]: searchSplit[1] && parseInt(searchSplit[1]) 
                            ? `%${parseInt(searchSplit[1])}%` : `%%`
                    },
                    number_chapter: {
                        [Op.like]: searchSplit[2] && parseInt(searchSplit[2]) 
                            ? `%${parseInt(searchSplit[2])}%` : `%%`
                    },
                    number_paragraph: {
                        [Op.like]: searchSplit[3] && parseInt(searchSplit[3]) 
                            ? `%${parseInt(searchSplit[3])}%` : `%%`
                    }
                }
            }
        });

        if(!userQuery) {
            return res.send([]);
        }

        const result = [];
        const user = userQuery.toJSON();

        for(const comment of user.comment_paragraphs) {
            const id = `${user.id}, ${comment.id_opera}, ${comment.number_book}, ${comment.number_chapter}, ${comment.number_paragraph}`;
            const name = `${user.name} ${user.surname}, ${comment.number_paragraph}`;

            if(!result.some((item) => item.id === id)) {
                result.push({
                    id: id,
                    name: name
                })
            }
        }

        return res.send(result);
    } catch(e) {
        
        return res.status(500).send(e.message);
    }
});*/

router.get('/out', getOutRichText);

router.get('/in', getInRichText);

router.get('/comment', getCommentRichText);

module.exports = router;