import { atom } from 'recoil';

export const roomCommentsAtom = atom({
    key: `roomAtom`,
    default: {
        idRoom: null,
        filter: null
    },
});