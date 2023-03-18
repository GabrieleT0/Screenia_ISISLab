import { selector } from "recoil";
import { fetchParagraph } from "../../api/opereApi";
import { paragraphAtom } from "./paragraphAtom";

export const getParagraphsSelector = selector({
    key: 'getParagraphsSelector',
    get: async ({ get }) => {
        const paragraph = get(paragraphAtom);
        if(!paragraph.idOpera || !paragraph.idBook || !paragraph.idChapter) {
            return [];
        }

        try {
            const response = await fetchParagraph(
                paragraph.idOpera,
                paragraph.idBook,
                paragraph.idChapter
            )
            
            return [...response.data];
        } catch(error) {
            throw error;
        }
    },
});
