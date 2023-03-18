import { 
    opera_primary_literature,
    author_primary_literature,
    edition,
    volume_edition
} from "../../models";

const getOperaById = async (id) => {
    try {
        const Opera = opera_primary_literature;
        const Author = author_primary_literature;
        const Edition = edition;
        const Volume = volume_edition;
        const result = await Opera.findOne({
        where: {
            id: id
        },
        include: [
            { model: Author, as: 'authors' },
            { 
            model: Edition, 
            as: 'editions',
            include: { model: Volume, as: "volume_editions" }
            }
        ]
        })

        return result;
    } catch(error) {
        throw Error(error.message);
    }
}

const getAllOperaByFilter = async (offset, limit, filters = {}) => {
 
    try {
        const Author = author_primary_literature;
        const Edition = edition;
        const Volume = volume_edition;
        const opere = await opera_primary_literature.findAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['insert_date', 'DESC']],
            where: { ...filters },
            include: [
                { model: Author, as: 'authors' },
                { 
                    model: Edition, 
                    as: 'editions',
                    include: { model: Volume, as: "volume_editions" }
                }
            ]
        });

        return opere;
    } catch(error) {
        throw Error(error.message);
    }
}

const OperaService = {
    getOperaById,
    getAllOperaByFilter
}

export default OperaService;