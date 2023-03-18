import { toast } from 'react-toastify';
import { selector, selectorFamily } from 'recoil';
import { fetchParagraph } from '../../api/opereApi';
import { operaDetailsAtom } from './opereAtom';

const selectorBooksOfOpera = selector({
    key: 'selectorBooksOfOpera',
    get: ({ get }) => {
      const opera = get(operaDetailsAtom);
  
      return opera?.books ? [...opera.books] : []
    },
});

const selectorEditionsOfOpera = selector({
    key: 'selectorEditionsOfOpera',
    get: ({ get }) => {
      const opera = get(operaDetailsAtom);
  
      return opera?.editions ? [...opera.editions] : []
    },
});

const selectorAuthorsOfOpera = selector({
    key: 'selectorAuthorsOfOpera',
    get: ({ get }) => {
      const opera = get(operaDetailsAtom);
  
      return opera?.authors ? [...opera.authors] : []
    },
});

const selectorChaptersOfBook = selectorFamily({
    key: 'selectorChaptersOfBook',
    get: (idBook) => ({ get }) => {
        if(!idBook) return [];

        const opera = get(operaDetailsAtom);
        
        if(!opera || !opera.books) return [];

        const bookFind = opera.books.find(({ number }) => parseInt(number) === parseInt(idBook));

        if(!bookFind || !bookFind.chapters) return [];

        return [...bookFind.chapters];
    }
});

const selectorParagraphsOfChapter = selectorFamily({
  key: 'selectorParagraphsOfChapter',
  get: (idOpera, idBook, idChapter) => async ({ get }) => {
    if(!idOpera || !idBook || !idChapter) return [];

    try {
      const response = await fetchParagraph(idOpera, idBook, idChapter);

      if(!response?.data || response.data.length === 0) {
        toast.info(`Non ci sono paragrafi per il capitolo #${idChapter}!`);
      }

      return [...response.data];
    } catch(e) {
        toast.error("Impossibile recuperare i paragrafi. Contattare l'amministrazione!");
    }
  }
});

export {
    selectorBooksOfOpera,
    selectorEditionsOfOpera,
    selectorAuthorsOfOpera,
    selectorChaptersOfBook,
    selectorParagraphsOfChapter
}
