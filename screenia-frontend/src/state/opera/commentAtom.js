import { atom } from "recoil"

const commentRefAtom = atom({
    key: 'commentRef',
    default: null
})

const commentContainerAtom = atom({
    key: 'commentContainerref',
    default: null
})

export {
    commentRefAtom,
    commentContainerAtom
};