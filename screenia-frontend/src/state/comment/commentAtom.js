import { atom } from 'recoil';

export const commentAtom = atom({
    key: 'commentAtom',
    default: {
      idOpera: null,
      idBook: null,
      idChapter: null,
      filters: null
    },
});
