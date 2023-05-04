import { Sequelize } from "sequelize";
import { book, chapter } from "../../models";

const getAllBookByOpera = async (idOpera) => {
    try {
        const Book = book;
        const Chapter = chapter;
        
        const results = await Book.findAll({
            where: {
                id_opera: idOpera
            },
            include: [
                { 
                    model: Chapter,
                    as: 'chapters',
                    required: false,
                    /*where: {
                        id_opera: idOpera,
                        number_book: Sequelize.col('book.number')
                    }*/
                    where: Sequelize.literal('chapters.id_opera = book.id_opera AND chapters.number_book = book.number')
                }
            ]
        })

        return results;
    } catch(error) {
        throw Error(error.message);
    }
}

const getBookByOpera = async (idOpera, idBook) => {
    try {
        const Book = book;
        const Chapter = chapter;
        
        const result = await Book.findOne({
            where: {
                id_opera: idOpera,
                number: idBook
            },
            include: [
                { 
                    model: Chapter, 
                    as: 'chapters',
                    where: {
                        id_opera: idOpera,
                        number_book: idBook
                    }
                }
            ]
        })

        return result;
    } catch(error) {
        throw Error(error.message);
    }
}

const BookService = {
    getAllBookByOpera,
    getBookByOpera
}

export default BookService;