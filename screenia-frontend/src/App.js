import Navbar from './components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import FullScreenLoader from './components/FullScreenLoader/FullScreenLoader';
import useLoader from './customHooks/loaderHooks/useLoader';
import { BrowserRouter, useLoaderData, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from './state/user/userAtom';
import { fetchCheckToken } from './api/authApi';
import useLocalStorage from './customHooks/localStorage/useLocalStorage';
import useCheckToken from './customHooks/authHooks/useCheckToken';
import ConfirmModal from './components/Dialog/ConfirmDialog';
import authTokenAtom from './state/authToken/authTokenAtom';

function App() {
  const { isOpenLoader } = useLoader();
  
  return (
    <>
        <FullScreenLoader isOpenLoader={isOpenLoader} />
        <ConfirmModal />
        <ToastContainer
          position="top-right"
          theme="colored"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
    </>
  );
}

export default App;
