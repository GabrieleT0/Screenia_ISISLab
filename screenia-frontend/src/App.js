import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from './components/Dialog/ConfirmDialog';
import FullScreenLoader from './components/FullScreenLoader/FullScreenLoader';
import Navbar from './components/Navbar/Navbar';
import useTokenExpirationChecker from './customHooks/authHooks/useTokenExpirationChecker';
import useLoader from './customHooks/loaderHooks/useLoader';

function App() {
  const { isOpenLoader } = useLoader();
  useTokenExpirationChecker();

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
