import { selector, useRecoilCallback } from "recoil";
import { fetchAllComment } from "../../api/opereApi";
import { commentAtom } from "./commentAtom";

export const getCommentsSelector = selector({
    key: 'getCommentsSelector',
    get: async ({ get }) => {
        const comment = get(commentAtom);
        if(!comment.idOpera || !comment.idBook || !comment.idChapter) {
            return [];
        }

        try {
            const response = await fetchAllComment(
                comment.idOpera, 
                comment.idBook, 
                comment.idChapter, 
                comment.filters
            );
            
            return [...response.data];
        } catch(error) {
            console.log('Errore:', error)
            throw error;
        }
    },
});
  