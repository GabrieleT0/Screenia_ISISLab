import { useRecoilValue } from "recoil";
import { selectorAuthorsOfOpera, selectorBooksOfOpera, selectorEditionsOfOpera } from "../../state/opera/opereSelector";

const useOperaDetails = () => {
    const books = useRecoilValue(selectorBooksOfOpera);
    const authors = useRecoilValue(selectorAuthorsOfOpera);
    const editions = useRecoilValue(selectorEditionsOfOpera);

    return {
        books,
        authors,
        editions
    }
}

export default useOperaDetails;