import { atom } from "recoil"

const confirmModalAtom = atom({
    key: 'confirmModalAtom',
    default: {
        isOpen: false, 
        handleConfirm: null,
        title: "", 
        description: ""
    }
})

export default confirmModalAtom;