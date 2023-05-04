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
                        },
                        limit: 5,
                        order: [
                            ["number", "ASC"],
                        ]
                    }
                }
            ]
        });

        const result = [];
        for(const author of resultQuery) {

            if(author && author.id) {
                
                if(author.opera_authors) {
                    for(const opera of author.opera_authors) {
                        const nameAuthorOpera = `Author ${author.name}, opera ${opera.title}`;
                        result.push({
                            id: `${opera.id}`,
                            name: nameAuthorOpera,
                            link: `${opera.id}`
                        })

                        const books = opera.books;
                        if(books) {
                            for(const book of books) {
                                const nameBook = `Author ${author.name}, opera ${opera.title}, book ${book.title ? book.title : book.number}`
                                result.push({
                                    id: `${opera.id}, ${book.number}`,
                                    name: nameBook,
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
                                    },
                                    limit: 5,
                                    order: [
                                        ["number", "ASC"],
                                    ]
                                });

                                if(chapters) {
                                    for(const chapter of chapters) {
                                        const nameChapter = `${nameBook}, chapter ${chapter.title ? chapter.number : chapter.number}`
                                        result.push({
                                            id: `${opera.id}, ${book.number}, ${chapter.number}`,
                                            name: nameChapter,
                                            link: `${opera.id}/${book.number}/${chapter.number}`
                                        })

                                        const paragraphs = await Paragraph.findAll({
                                            attributes: ['number', 'label'],
                                            where: {
                                                number: {
                                                    [Op.like]: searchSplit[4] ? `%${searchSplit[4].trim()}%` : `%%`
                                                },
                                                id_opera: opera.id,
                                                number_book: book.number,
                                                number_chapter: chapter.number
                                            },
                                            limit: 5,
                                            order: [
                                                ["label", "ASC"],
                                            ]
                                        });


                                        if(paragraphs) {
                                            const nameParagraph = `${nameChapter}, paragraph ${paragraph.label}`;
                                            for(const paragraph of paragraphs) {
                                                result.push({
                                                    id: `${opera.id}, ${book.number}, ${chapter.number}, ${paragraph.number}`,
                                                    name: nameParagraph,
                                                    link: `${opera.id}/${book.number}/${chapter.number}/${paragraph.number}`
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
                    order: [
                        ["number", "ASC"],
                    ]
                }
            ]
        });

        if(!resultQuery) {
            return [];
        }

        const opera = resultQuery.toJSON();

        const result = [];
        if(opera && opera.id) {
            const books = opera.books;

            if(books) {
                for (const book of books) {
                    const nameBook = book.title ? `Book ${book.title}` : `Book ${book.number}`
                    result.push({
                        id: `${opera.id}, ${nameBook}`,
                        name: nameBook,
                        link: `${opera.id}/${book.number}`,
                    })

                    const chapters = await Chapter.findAll({
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
                            id_opera: idOpera,
                            number_book: book.number
                        },
                        order: [
                            ["number", "ASC"],
                        ],
                        limit: 5
                    });

                    if(chapters) {
                        for (const chapter of chapters) {
                            const nameBookAndChapter = chapter.title ? `${nameBook}, chapter ${chapter.title}` : `${nameBook}, chapter ${chapter.number}`
                            result.push({
                                id: `${opera.id}, ${book.number}, ${chapter.number}`,
                                name: nameBookAndChapter,
                                link: `${opera.id}/${book.number}/${chapter.number}`,
                            })

                            const paragraphs = await Paragraph.findAll({
                                attributes: ['number', 'label'],
                                where: {
                                    label: {
                                        [Op.like]: searchSplit[2] ? `%${searchSplit[2].trim()}%` : `%%`
                                    },
                                    id_opera: opera.id,
                                    number_book: book.number,
                                    number_chapter: chapter.number
                                },
                                order: [
                                    ["label", "ASC"],
                                ],
                                limit: 5, //Return the first 5 results for performance reasons
                            });

                            if(paragraphs) {
                                for(const paragraph of paragraphs) {
                                    let nameBookChapterAndPar = `${nameBookAndChapter}, paragraph ${paragraph.label}`;

                                    result.push({
                                        id: `${opera.id}, ${book.number}, ${chapter.number}, ${paragraph.number}`,
                                        name: nameBookChapterAndPar,
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