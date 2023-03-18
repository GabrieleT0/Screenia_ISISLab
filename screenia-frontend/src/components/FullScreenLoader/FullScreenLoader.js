import ReactDOM from 'react-dom';
import { Backdrop, CircularProgress } from "@mui/material"

const FullScreenLoader = ({ isOpenLoader }) => isOpenLoader ? ReactDOM.createPortal(
    <>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isOpenLoader}
        >
            <CircularProgress color="primary" />
        </Backdrop>
        </>, document.body
) : null;

export default FullScreenLoader;