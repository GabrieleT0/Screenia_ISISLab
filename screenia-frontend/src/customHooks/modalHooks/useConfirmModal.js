const { useState } = require("react")

const useConfirmModal = ({ titleModal = "", descriptionModal = "", handleConfirm }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSetOpen = () => {
        setIsOpen(!isOpen);
    }

    return {
        isOpenModal: isOpen,
        setModal: handleSetOpen,
        handleConfirm: handleConfirm,
        titleModal,
        descriptionModal
    }
}

export default useConfirmModal;