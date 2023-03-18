import { toast } from "react-toastify";
import { useRecoilCallback } from "recoil";
import { fetchAllAuthorByOpera, fetchAllEditionByOpera, fetchBooksByOpera, fetchOpera, fetchParagraph } from "../../api/opereApi";
import { operaDetailsAtom } from "./opereAtom";

const fetchOperaDetails = useRecoilCallback(({ set }) => async (id) => {
    try {
        const responseOpera = await fetchOpera(id);
        const responseBooks = await fetchBooksByOpera(id);
        const responseAuthors = await fetchAllAuthorByOpera(id);
        const responseEditions = await fetchAllEditionByOpera(id);

        set(operaDetailsAtom, { 
            ...responseOpera.data,
            books: [...responseBooks.data],
            editions: [...responseAuthors.data],
            authors: [...responseEditions.data]
        });
    } catch(e) {
        return toast.error("Unable to upload the work. Please contact the administration!");
    }
});

export {
    fetchOperaDetails
}