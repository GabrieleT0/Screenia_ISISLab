import { useState } from 'react';

const useLoader = () => {
  const [isOpenLoader, setIsOpenLoeader] = useState(false);

  function setLoader() {
    setIsOpenLoeader(!isOpenLoader);
  }

  return {
    isOpenLoader,
    setLoader,
  }
};

export default useLoader;