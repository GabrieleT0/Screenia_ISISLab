import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchAllComment } from '../../api/opereApi';

const useCommentsChapter = () => {
    const [chapter, setChapter] = useState({
        idOpera: null,
        idBook: null,
        idChapter: null,
        filter: null
    });
    const [comments, setComments] = useState([]);

    useEffect(() => {
        loadData();
    }, [chapter])

    const loadData = async () => {
        const { idOpera, idBook, idChapter, filter } = chapter;

        if(!idOpera || !idBook || !idChapter) return [];

        try {
            const response = await fetchAllComment(idOpera, idBook, idChapter, filter);

            return setComments([...response.data]);
        } catch(e) {
            
            toast.error("Impossibile recuperare i commenti. Contattare l'amministrazione!");
        }
    }

    return {
        comments: comments,
        setDataLoadComments: setChapter
    }
}

export default useCommentsChapter;