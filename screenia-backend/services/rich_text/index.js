import { Op, Sequelize } from "sequelize";
import {
    opera_primary_literature,
    author_primary_literature,
    book,
    chapter,
    paragraph,
    user as userModel,
    comment_paragraph
} from "../../models";

const getRichTextOutOpera = async (idOpera, value = "") => {
    const searchSplit = value.split(",");

    try {
        const Opera = opera_primary_literature;
        const Author = author_primary_literature;
        const Book = book;
        const Chapter = chapter;
        const Paragraph = paragraph;

        const resultQuery = await Author.findAll({
            attributes: ['id', 'name'],
            where: {
                name: {
                    [Op.like]: `%${searchSplit[0].trim()}%`
                }
            },
            limit: 5, //Return the first 5 results for performance reasons
            order: [
                ['name', 'ASC']
            ],
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
                            [Op.or]: [
                                { 
                                    number: {
                                        [Op.like]: searchSplit[2] ? `%${searchSplit[2].trim()}%` : `%%`
                                    } 
                                },
                                { 
                                    title: {
                                        [Op.like]: searchSplit[2] ? `%${searchSplit[2].trim()}%` : `%%`
                                    } 
                                }
                            ]
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
                        value = `Author ${author.name}, opera ${opera.title}`;
                        result.push({
                            id: `${author.id}, ${opera.id}`,
                            name: value,
                            link: `${opera.id}`
                        })

                        const books = opera.books;
                        if(books) {
                            for(const book of books) {
                                value = `Author ${author.name}, opera ${opera.title}, book ${book.title ? book.title : book.number}`
                                result.push({
                                    id: `${author.id}, ${opera.id}, ${book.number}`,
                                    name: value,
                                    link: `${opera.id}/${book.number}`
                                })

                                const chapters = await Chapter.findAll({
                                    attributes: ['number', 'title'],
                                    where: {
                                        [Op.or]: [
                                            { 
                                                number: {
                                                    [Op.like]: searchSplit[3] ? `%${searchSplit[3].trim()}%` : `%%`
                                                } 
                                            },
                                            { 
                                                title: {
                                                    [Op.like]: searchSplit[3] ? `%${searchSplit[3].trim()}%` : `%%`
                                                } 
                                            }
                                        ],
                                        id_opera: opera.id,
                                        number_book: book.number
                                    }
                                });

                                if(chapters) {
                                    for(const chapter of chapters) {
                                        value = `${value}, chapter ${chapter.title ? chapter.number : chapter.number}`
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
                                            let index = 0;
                                            for(const paragraph of paragraphs) {
                                                if(index === 0) {
                                                    value = `${value}, paragraph ${paragraph.number}`
                                                } else {
                                                    value = `${value}, ${paragraph.number}`
                                                }
                                                result.push({
                                                    id: `${author.id}, ${opera.id}, ${book.number}, ${chapter.number}, ${paragraph.number}`,
                                                    name: value,
                                                    link: `${opera.id}/${book.number}/${chapter.number}`
                                                })

                                                index = index+1;
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
        return result.slice(0, 5) || [];
    } catch(e) {
        throw new Error(e);
    }
};

const getRichTextInOpera = async (idOpera, value = "") => {
    const searchSplit = value.split(",");

    try {
        const Opera = opera_primary_literature;
        const Book = book;
        const Chapter = chapter;
        const Paragraph = paragraph;

        const resultQuery = await Opera.findOne({
            attributes: ['id', 'title'],
            where: {
                id: idOpera
            },
            limit: 5, //Return the first 5 results for performance reasons
            include: [
                {
                    model: Book,
                    as: 'books',
                    attributes: ['number', 'title'],
                    where: {
                        [Op.or]: [
                            { 
                                number: {
                                    [Op.like]: searchSplit[0] ? `%${searchSplit[0].trim()}%` : `%%`
                                } 
                            },
                            { 
                                title: {
                                    [Op.like]: searchSplit[0] ? `%${searchSplit[0].trim()}%` : `%%`
                                } 
                            }
                        ],
                        id_opera: idOpera
                    },
                    include: {
                        model: Chapter,
                        as: 'chapters',
                        attributes: ['number', 'title'],
                        where: {
                            [Op.or]: [
                                { 
                                    number: {
                                        [Op.like]: searchSplit[1] ? `%${searchSplit[1].trim()}%` : `%%`
                                    } 
                                },
                                { 
                                    title: {
                                        [Op.like]: searchSplit[1] ? `%${searchSplit[1].trim()}%` : `%%`
                                    } 
                                }
                            ],
                            id_opera: idOpera
                        }
                    }
                }
            ]
        });

        if(!resultQuery) {
            return [];
        }

        const opera = resultQuery.toJSON();

        const result = [];
        let name = "";
        if(opera && opera.id) {
            const books = opera.books;

            if(books) {
                for(const book of books) {
                    name = book.title ? `Book ${book.title}` : `Book ${book.number}`
                    result.push({
                        id: `${opera.id}, ${name}`,
                        name: name,
                        link: `${opera.id}/${book.number}`,
                    })

                    const chapters = book.chapters;
                    if(chapters) {
                        for (const chapter of chapters) {
                            name = chapter.title ? `${name}, chapter ${chapter.title}` : `${name}, chapter ${chapter.number}`
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
                                let index = 0;
                                for(const paragraph of paragraphs) {
                                    if(index === 0) {
                                        name = `${name}, paragraph ${paragraph.number}`
                                    } else {
                                        name = `${name}, ${paragraph.number}`
                                    }

                                    result.push({
                                        id: `${opera.id}, ${name}`,
                                        name: name,
                                        link: `${opera.id}/${book.number}/${chapter.number}/${paragraph.number}`,
                                    })
                                    index=index+1;
                                }
                            }
                        }
                    }
                }
            }
        }

        //Return the first 5 results for performance reasons
        return result.slice(0, 5) || [];
    } catch(e) {
        throw new Error(e);
    }
};

const getRichTextCommentOpera = async (idOpera, value = "") => {
    const searchSplit = value.split(",");

    try {
        const User = userModel;
        const Comment = comment_paragraph;
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
            limit: 5, //Return the first 5 results for performance reasons
            order: [
                ['surname', 'ASC']
            ],
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
            return [];
        }

        const result = [];
        const user = userQuery.toJSON();

        for(const comment of user.comment_paragraphs) {
            const id = `${user.id}, ${comment.id_opera}, ${comment.number_book}, ${comment.number_chapter}, ${comment.number_paragraph}`;
            const name = `Editor ${user.name} ${user.surname}, reference paragraph comment number ${comment.number_paragraph}`;

            if(!result.some((item) => item.id === id)) {
                result.push({
                    id: id,
                    name: name
                })
            }
        }

        //Return the first 5 results for performance reasons
        return result.slice(0, 5) || [];
    } catch(e) {
        throw new Error(e);
    }
};

const RichTextService = {
    getRichTextOutOpera,
    getRichTextInOpera,
    getRichTextCommentOpera
}

export default RichTextService;