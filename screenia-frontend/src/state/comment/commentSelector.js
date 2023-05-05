import { selector, useRecoilState } from "recoil";
import { fetchAllComment } from "../../api/opereApi";
import { commentAtom } from "./commentAtom";

export const getCommentsSelector = selector({
    key: 'getCommentsSelector',
    get: async ({ get }) => {
        const comment = get(commentAtom);

        if(!comment.idOpera) {
            return [];
        }

        if(comment.idBook === null || comment.idBook === undefined) {
            return [];
        }

        if(comment.idChapter === null || comment.idChapter === undefined) {
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
            
            //throw error;
        }
    },
});
  