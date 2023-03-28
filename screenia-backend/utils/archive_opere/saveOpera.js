import { 
    author_opera_primary_literature, 
    book, 
    chapter,
    date_author_primary_literature,
    edition, 
    opera_primary_literature, 
    paragraph, 
    place_author_primary_literature, 
    volume_edition,
    author_primary_literature,
    db
} from '../../models';
import logger from '../log/loggers';
import { readInfoOpera, readOpera } from './extract';

const storeArchiveOpera = async (filePathOpera, callback) => {
    logger.info(`[STORE OPERA] - Start Path File: ${filePathOpera}`);
    console.log('db', db)
    const transaction = await db.sequelize.transaction();

    try {
        const infoOpera = await readInfoOpera(`${filePathOpera}/info.json`);
        const { Author } = infoOpera;

        //Insert Authors
        const AuthorPrimaryModel = author_primary_literature;

        let authorFind = await AuthorPrimaryModel.findOne({ where: {
            name: Author.name
        }});

        let AuthorPrimaryDB = null;

        if(authorFind && authorFind.toJSON().id) {
            AuthorPrimaryDB = authorFind.toJSON();
            logger.info(`[STORE OPERA] - Author exist`);
        } else {
            const authorInsert = await AuthorPrimaryModel.create({
                name: Author.name,
                it_name: Author.name_ita,
                en_name: Author.name_en,
                fr_name: Author.name_fr,
                de_name: Author.name_de,
                short_name: Author.name_short,
                comment: Author.comment,
                insert_date: new Date()
            }, { transaction: transaction });
            
            AuthorPrimaryDB = authorInsert.dataValues;
            logger.info(`[STORE OPERA] - Create Author`);
        }
        
        //Insert Dates of Author
        if(Array.isArray(Author.Dates) && Author.Dates.length > 0) {
            const dates = Author.Dates.map((itemDate) => {
                return {
                    data: itemDate.date,
                    is_reference_date: itemDate.reference_date,
                    is_birth_date: itemDate.birth_date,
                    is_death_date: itemDate.death_date,
                    id_author: AuthorPrimaryDB.id,
                    comment: itemDate.comment
                }
            })

            const DateAuthorPrimaryModel = date_author_primary_literature;
            await DateAuthorPrimaryModel.bulkCreate(dates, { transaction: transaction })
            logger.info(`[STORE OPERA] - Create Dates Author`);
        }

        //Insert Places of Author
        if(Array.isArray(Author.Places) && Author.Places.length > 0) {
            const places = Author.Places.map((itemPlace) => {
                return {
                    place: itemPlace.place,
                    current_place: itemPlace.current_place,
                    is_birth_place: itemPlace.birth_place,
                    is_death_place: itemPlace.death_place,
                    id_author: AuthorPrimaryDB.id,
                    is_reference_place: itemPlace.reference_place,
                    comment: itemPlace.comment
                }
            })

            const PlaceAuthorPrimaryModel = place_author_primary_literature;
            await PlaceAuthorPrimaryModel.bulkCreate(places, { transaction: transaction });
            logger.info(`[STORE OPERA] - Create Dates Author`);
        }

        //Insert Opera
        const { Opera } = infoOpera;

        const OperaPrimaryLiterature = opera_primary_literature;

        const OperaPrimaryDB = await OperaPrimaryLiterature.create({
            title: Opera.title,
            it_title: Opera.title_ita,
            en_title: Opera.title_en,
            fr_title: Opera.title_fr,
            de_title: Opera.title_de,
            short_title: Opera.title_short,
            date_composition: Opera.date_composition,
            place_composition: Opera.place_composition,
            current_place_composition: Opera.current_place_composition,
            comment: Opera.comment,
            insert_date: new Date()
        }, { transaction: transaction });
        logger.info(`[STORE OPERA] - Create Opera`);

        //Insert Author_Opera
        const AuthorOperaPrimary = author_opera_primary_literature;
        await AuthorOperaPrimary.create({
            id_author: AuthorPrimaryDB.id,
            id_opera: OperaPrimaryDB.dataValues.id
        }, { transaction: transaction });
        logger.info(`[STORE OPERA] - Create Author_Opera`);

        //Insert Edition and Volums
        const Edition = edition;
        const Volums = volume_edition;
        const editionsOpera = Opera.Editions.map((itemEdition) => {
            const volums = itemEdition.volumes.map((volume, index) => (
                {
                    number: index,
                    title: volume
                }
            ));

            return {
                ISBN: itemEdition.ISBN,
                publisher: itemEdition.publisher,
                series: itemEdition.series,
                date: itemEdition.date,
                place: itemEdition.place,
                is_reference: itemEdition.reference_edition,
                IPI: itemEdition.IPI,
                id_opera: OperaPrimaryDB.dataValues.id,
                volume_editions: volums
            }
        })

        await Edition.bulkCreate(editionsOpera, {
            include: { model: Volums, as: "volume_editions"},
            transaction: transaction
       })
       logger.info(`[STORE OPERA] - Create Editions and Volums`);

       let chaptersInfo = [];
        //Insert Books, Chapters and Paragraphs
        if(Array.isArray(Opera.Books) && Opera.Books.length > 0) {
            const BookModel = book;

            const books = Opera.Books.map((itemBook) => {
                itemBook.Chapters.map((itemChapter) => {
                    chaptersInfo.push({
                        number: itemChapter.number,
                        number_book: itemBook.number,
                        id_opera: OperaPrimaryDB.dataValues.id,
                        title: itemChapter.title,
                        it_title: itemChapter.title_ita,
                        en_title: itemChapter.title_en,
                        fr_title: itemChapter.title_fr,
                        de_title: itemChapter.title_de,
                    })
                });

                return {
                    number: itemBook.number,
                    id_opera: OperaPrimaryDB.dataValues.id,
                    number_volume: itemBook.volume,
                    ISBN_Edition: itemBook.ISBN_Edition,
                    title: itemBook.title,
                    it_title: itemBook.title_ita,
                    en_title: itemBook.title_en,
                    fr_title: itemBook.title_fr,
                    de_title: itemBook.title_de
                }
            })

            const booksInsert = await BookModel.bulkCreate(books, {
                //include: { model: ChapterModel, as: "chapters" },
                transaction: transaction
            })
            logger.info(`[STORE OPERA] - Create Books`);
        }

        //Parapraphs Opera in file
        const operaContents = await readOpera(filePathOpera);

        if(!operaContents) {
            throw new Error("Paraprahs in file not found!");
        }

        const ParagraphModel = paragraph;

        //[START] Retrive Paragraphs in File
        const paragraphs = [];
        const chapters = [
            ...chaptersInfo
        ];

        const ChapterModel = chapter;
        operaContents.forEach((itemParagraph) => {
            if(!itemParagraph || !itemParagraph.contents) {
                throw new Error("The content of the paragraph cannot be empty!");
            }

            if(!chapters.some(({ number, number_book }) => (
                parseInt(number) === parseInt(itemParagraph.chapter) &&
                parseInt(number_book) === parseInt(itemParagraph.book)
            ))) {
                chapters.push({
                    number: parseInt(itemParagraph.chapter),
                    number_book: parseInt(itemParagraph.book),
                    id_opera: OperaPrimaryDB.dataValues.id,
                    title: null,
                    it_title: null,
                    en_title: null,
                    fr_title: null,
                    de_title: null,
                });
            }
            
            itemParagraph.contents.map((content, index) => { 
                //Recupero la label, cioé il testo che sta prima del carattere "#" (se presente)
                let labelParagraph = null;
                let contentParagraph = null;

                if (content.includes("#")) {
                    const contentSplitLabel = content.split("#");
                    labelParagraph = contentSplitLabel[0];
                    contentParagraph = contentSplitLabel[1];
                } else {
                    contentParagraph = content;
                }

                paragraphs.push({
                    number: index+1,
                    number_book: itemParagraph.book,
                    number_chapter: itemParagraph.chapter,
                    id_opera: OperaPrimaryDB.dataValues.id,
                    text: contentParagraph.trim(),
                    number_paragraph_infr: index === 0 ? null : index,
                    number_paragraph_supr: (index === itemParagraph.contents.length - 1) ? null : index+2,
                    label: labelParagraph
                })
            })
        });
        //[END] Retrive Paragraphs in File

        await ChapterModel.bulkCreate([...chapters], { transaction: transaction });
        logger.info(`[STORE OPERA] - Create Chapters}`);

        await ParagraphModel.bulkCreate(paragraphs, { transaction: transaction });
        logger.info(`[STORE OPERA] - Create Paragraphs`);

        await transaction.commit();
        logger.info(`[STORE OPERA] - END: COMMIT WITH SUCCESS`);

    } catch (error) {
        await transaction.rollback();
        logger.error(`[STORE OPERA] - Rollback - Error: ${error}`);
        throw new Error(error.message);
    } finally {
        callback();
    }
}

export {
    storeArchiveOpera
}