import ChapterService from "../../services/chapter";

const getAllChapter = async function (req, res) {
    const idOpera = req.params.idOpera;
    const idBook = req.params.idBook;
  
    if(!idOpera) {
      return res.send(400, "Param idOpera is required!");
    }
  
    if(!idBook) {
        return res.send(400, "Param idBook is required!");
    }
  
    try {
        const chapters = await ChapterService.getAllChapter(idOpera, idBook);

        return res.send(chapters);
    } catch(e) {
        return res.status(500).send(e.message);
    }
}

export {
    getAllChapter
}