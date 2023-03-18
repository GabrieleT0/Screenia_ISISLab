import BookService from "../../services/book";

const getBooksByOpera = async function (req, res) {
    const idOpera = req.params.idOpera;
  
    if(!idOpera) {
      return res.send(400, "Param idOpera is required!");
    }
  
    try {
        const results = await BookService.getAllBookByOpera(idOpera);
  
        return res.send(results);
    } catch(e) {
        return res.status(500).send({
            error: e,
            message: e.message
        });
    }
  
}

const getBookByOpera = async function (req, res) {
    const idOpera = req.params.idOpera;
    const idBook = req.params.idBook;
  
    if(!idOpera) {
      return res.send(400, "Param idOpera is required!");
    }
  
    if(!idBook) {
      return res.send(400, "Param idBook is required!");
    }
  
    try {
      const result = await BookService.getBookByOpera(idOpera, idBook);
  
      return res.send(result);
    } catch(e) {
      return res.status(500).send({
        error: e,
        message: e.message
      });
    }
}

export {
    getBookByOpera,
    getBooksByOpera
}