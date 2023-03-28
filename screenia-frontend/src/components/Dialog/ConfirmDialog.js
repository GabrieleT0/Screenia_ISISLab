import * as React from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRecoilState } from 'recoil';
import confirmModalAtom from '../../state/modal/confirmModalAtom';

const ConfirmModal = () => {
  const [modal, setModal] = useRecoilState(confirmModalAtom);
  const { isOpen, handleConfirm, title, description } = modal;

  const handleClose = (confirm = false) => {
    if(confirm && handleConfirm) {
        handleConfirm();
    }

    setModal({
        isOpen: false,
        title: "",
        description: "",
        handleConfirm: null
    });
  };

  return ReactDOM.createPortal(
    isOpen && 
    (<Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {description}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button color="error" onClick={() => handleClose(false)}>
                Disagree
            </Button>
            <Button color="success" onClick={() => handleClose(true)} autoFocus>
                Agree
            </Button>
        </DialogActions>
    </Dialog>
  ),  document.getElementById('rootModal'));
}

export default ConfirmModal;