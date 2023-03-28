import RichTextService from "../../services/rich_text";

const getOutRichText = async (req, res) => {
    const { idOpera, value = "" } = req.query;

    if(!idOpera) {
        return res.send([]);
    }

    if(value.trim().length === 0) {
        return res.send([]);
    }

    try {
        const result = await RichTextService.getRichTextOutOpera(idOpera, value);

        return res.status(200).send(result);
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
}

const getInRichText = async (req, res) => {
    const { idOpera, value = "" } = req.query;

    if(!idOpera) {
        return res.send([]);
    }

    if(value.trim().length === 0) {
        return res.send([]);
    }

    try {
        const result = await RichTextService.getRichTextInOpera(idOpera, value);

        return res.status(200).send(result);
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
}

const getCommentRichText = async (req, res) => {
    const { idOpera, value = "" } = req.query;

    if(!idOpera) {
        return res.send([]);
    }

    if(value.trim().length === 0) {
        return res.send([]);
    }

    try {
        const result = await RichTextService.getRichTextCommentOpera(idOpera, value);

        return res.status(200).send(result);
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
}

export {
    getOutRichText,
    getInRichText,
    getCommentRichText
}