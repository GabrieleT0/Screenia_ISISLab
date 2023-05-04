import ReactDOM from 'react-dom';
import { Backdrop, CircularProgress } from "@mui/material"
import { useEffect, useState } from 'react';

const FullScreenLoader = ({ isOpenLoader }) => {
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      setIsLoading(isOpenLoader);
    }, [isOpenLoader]);
  
    return isLoading ? ReactDOM.createPortal(
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={isLoading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </>, document.body
    ) : null;
  };

export default FullScreenLoader;