import { atom } from 'recoil';

export const paragraphAtom = atom({
    key: 'paragraphAtom',
    default: {
      idOpera: null,
      idBook: null,
      idChapter: null
    },
});