const { chapter } = require("../../models");

const getAllChapter = async (idOpera, idBook) => {
    try {
        const Chapter = chapter;
  
        const chapters = await Chapter.findAll({
            where: {
            id_opera: idOpera,
            number_book: idBook
            }
        })

        return chapters;
    } catch(error) {
        throw Error(error.message)
    }
}

const ChapterService = {
    getAllChapter
}
export default ChapterService;