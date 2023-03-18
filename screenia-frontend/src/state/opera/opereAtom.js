import { atom } from "recoil"

const opereAtom = atom({
    key: 'opereAtom',
    default: []
});

const operaDetailsAtom = atom({
    key: 'operaDetailsAtom',
    default: {}
});

const syncTextCommentOpera = atom({
    key: 'syncTextCommentOpera',
    default: true
})

export { 
    opereAtom,
    operaDetailsAtom,
    syncTextCommentOpera
 };